import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const reviews = await prisma.review.findMany({
    where: { productId: params.productId },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { rating, content } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Review content is required" }, { status: 400 });
    }

    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        productId: params.productId,
        order: { buyerId: userId },
      },
    });

    if (!hasOrdered) {
      return NextResponse.json(
        { error: "You can only review products you've purchased" },
        { status: 403 }
      );
    }

    const existing = await prisma.review.findUnique({
      where: { productId_authorId: { productId: params.productId, authorId: userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You've already reviewed this product" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: params.productId,
        authorId: userId,
        rating: Number(rating),
        content,
      },
    });

    const agg = await prisma.review.aggregate({
      where: { productId: params.productId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: params.productId },
      data: {
        rating: agg._avg.rating || 0,
        reviewCount: agg._count,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
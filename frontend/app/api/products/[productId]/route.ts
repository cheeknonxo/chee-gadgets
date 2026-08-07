import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id: params.productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  if (product.sellerId !== userId && role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, aboutItem, price, discount, brand, category, color, images, stockItems } = body;

    const updated = await prisma.product.update({
      where: { id: params.productId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(aboutItem !== undefined && { aboutItem: Array.isArray(aboutItem) ? aboutItem : [] }),
        ...(price !== undefined && { price }),
        ...(discount !== undefined && { discount: Number(discount) }),
        ...(stockItems !== undefined && { stockItems: Number(stockItems) }),
        ...(brand !== undefined && { brand }),
        ...(category !== undefined && { category }),
        ...(color !== undefined && { color: Array.isArray(color) ? color : [] }),
        ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id: params.productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  if (product.sellerId !== userId && role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    await prisma.product.delete({ where: { id: params.productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Could not delete product. It may have existing orders tied to it." },
      { status: 500 }
    );
  }
}
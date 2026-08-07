import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "SELLER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Only sellers can add products" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, aboutItem, price, discount, brand, category, color, images, stockItems } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        aboutItem: Array.isArray(aboutItem) ? aboutItem : [],
        price,
        discount: discount ? Number(discount) : 0,
        stockItems: stockItems ? Number(stockItems) : 0,
        brand,
        category,
        color: Array.isArray(color) ? color : [],
        images: Array.isArray(images) ? images : [],
        sellerId: (session.user as any).id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("sellerId");

  const products = await prisma.product.findMany({
    where: sellerId ? { sellerId } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
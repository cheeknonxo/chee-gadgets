import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { cartItems, shippingForm } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!shippingForm) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    const { firstName, lastName, address, phone, city, zip, country } = shippingForm;
    if (!firstName || !lastName || !address || !phone || !city || !zip || !country) {
      return NextResponse.json({ error: "Incomplete shipping address" }, { status: 400 });
    }

    const groupedBySeller: Record<string, any[]> = {};
    for (const item of cartItems) {
      if (!item.sellerId) {
        return NextResponse.json({ error: "Cart item missing seller information" }, { status: 400 });
      }
      if (!groupedBySeller[item.sellerId]) groupedBySeller[item.sellerId] = [];
      groupedBySeller[item.sellerId].push(item);
    }

    const buyerId = (session.user as any).id;

    const createdOrders = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) {
          throw new Error(`Product "${item.name}" no longer exists`);
        }
        if (product.stockItems < item.quantity) {
          throw new Error(
            `Not enough stock for "${item.name}" — only ${product.stockItems} left`
          );
        }
      }

      const orders = [];

      for (const sellerId of Object.keys(groupedBySeller)) {
        const items = groupedBySeller[sellerId];
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingFee = 5;
        const tax = subtotal * 0.1;
        const total = subtotal + shippingFee + tax;

        const order = await tx.order.create({
          data: {
            buyerId,
            sellerId,
            subtotal,
            shippingFee,
            tax,
            total,
            firstName,
            lastName,
            address,
            city,
            zip,
            country,
            phone,
            items: {
              create: items.map((item) => ({
                productId: item.id,
                name: item.name,
                image: item.images?.[0] || null,
                price: item.price,
                quantity: item.quantity,
              })),
            },
          },
          include: { items: true },
        });

        for (const item of items) {
          await tx.product.update({
            where: { id: item.id },
            data: { stockItems: { decrement: item.quantity } },
          });
        }

        orders.push(order);
      }

      return orders;
    });

    return NextResponse.json({ orders: createdOrders }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const as = searchParams.get("as");
  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: as === "seller" ? { sellerId: userId } : { buyerId: userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
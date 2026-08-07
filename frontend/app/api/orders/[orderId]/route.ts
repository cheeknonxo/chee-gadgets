import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const userId = (session.user as any).id;
  if (order.buyerId !== userId && order.sellerId !== userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const userId = (session.user as any).id;
  if (order.sellerId !== userId) {
    return NextResponse.json({ error: "Only the seller can update this order" }, { status: 403 });
  }

  const { status } = await req.json();
  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: params.orderId },
    data: { status },
  });

  return NextResponse.json(updated);
}
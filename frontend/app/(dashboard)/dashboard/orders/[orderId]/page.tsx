import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface OrderDetailsProps {
  params: { orderId: string };
}

const OrderDetails = async ({ params }: OrderDetailsProps) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const userId = (session.user as any).id;
  if (order.buyerId !== userId && order.sellerId !== userId) {
    redirect("/dashboard/orders");
  }

  return (
    <div className="max-w-screen-xl w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Order Details
      </h2>

      <Separator className="dark:bg-gray-500 my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Order Information
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Order Number: #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Customer Name: {order.firstName} {order.lastName}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Date: {order.createdAt.toLocaleDateString()}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Status:{" "}
            <span
              className={`inline-flex text-sm font-semibold rounded-full px-2 ${
                order.status === "SHIPPED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Shipping Information
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Address: {order.address}
          </p>
          <p className="text-gray-700 dark:text-gray-300">City: {order.city}</p>
          <p className="text-gray-700 dark:text-gray-300">
            Country: {order.country}
          </p>
          <p className="text-gray-700 dark:text-gray-300">Phone: {order.phone}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Ordered Products
        </h3>
        <ul className=" dark:divide-gray-700 my-4 space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="">
              <div className="flex justify-between items-center !border dark:border-gray-500 px-2 rounded-md ">
                <p className="text-gray-900 dark:text-white text-lg font-semibold">{item.name}</p>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt="product image"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700" />
                )}
                <p className="text-gray-700 dark:text-gray-300">
                  Qty : {item.quantity}
                </p>
                <p>Price : ${Number(item.price).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Total :
        </h3>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          ${Number(order.total).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
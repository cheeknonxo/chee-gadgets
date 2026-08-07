import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MyOrdersPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: (session.user as any).id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            You haven&apos;t placed any orders yet.
          </p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Date: {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Total: ${Number(order.total).toFixed(2)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Status: {order.status}
                  </p>
                </div>
                <Separator />

                <div>
                  <h2 className="text-lg font-medium my-2">Ordered Items</h2>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row justify-between items-center gap-2 p-2 shadow-sm mb-2"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt="Product"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700" />
                      )}
                      <p className="text-gray-800 dark:text-white">{item.name}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
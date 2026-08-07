import React from 'react';
import OrderActions from './OrderActions';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const RecentOrdersSection = async () => {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const recentOrders = userId
    ? await prisma.order.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
    : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic py-4">No orders yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.firstName} {order.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' : order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderActions orderId={order.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersSection;
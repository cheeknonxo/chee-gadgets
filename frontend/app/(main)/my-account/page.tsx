import Link from 'next/link';
import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const MyAccountPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-8">
          My Account
        </h1>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <p className="text-gray-800 dark:text-white">{user.name || 'Not set'}</p>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <p className="text-gray-800 dark:text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Type</label>
              <p className="text-gray-800 dark:text-white">{user.role}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <div className='flex items-center justify-between'>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Address</h2>
          <Link href={'/my-account/edit'} className='p-2 rounded-md border'>Edit Address</Link>
          </div>

          <div>
            <p className="text-gray-500 dark:text-gray-400 italic">No address on file yet. Add one to speed up checkout.</p>
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order History</h2>
          <div>
            <p className="text-gray-500 dark:text-gray-400 italic">No orders yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
import ProductActions from "@/components/dashboard/product/ProductActions";
import ProductHeader from "@/components/dashboard/product/ProductHeader";
import Loader from "@/components/others/Loader";
import Pagination from "@/components/others/Pagination";
import Image from "next/image";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ProductsPage = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const products = await prisma.product.findMany({
    where: { sellerId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <ProductHeader />
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic py-8 text-center">
            You haven&apos;t added any products yet.
          </p>
        ) : (
          <table className="min-w-full overflow-x-scroll divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-500">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="bg-white dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name.slice(0, 30)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stockItems}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Suspense fallback={<Loader />}>
          <Pagination totalPages={1} currentPage={1} pageName="productpage" />
        </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
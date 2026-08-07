import { Tabs, TabsContent } from "@/components/ui/tabs";
import React from "react";
import SingleProductCartView from "../product/SingleProductCartView";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/productDto";

const ProductsCollectionOne = async () => {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  const data = rows.map(toProductDTO);

  return (
    <section className="max-w-screen-xl mx-auto py-16 px-4 md:px-8 w-full">
      <Tabs defaultValue="top-rated" className="w-full space-y-8 mx-0">
        <div className="flex items-center flex-col md:flex-row justify-between gap-2 flex-wrap w-full">
          <h2 className="text-3xl md:text-5xl font-semibold border-l-4 border-l-rose-500 p-2">
            Featured Products
          </h2>
        </div>
        <TabsContent value="top-rated" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {data.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic col-span-full text-center py-8">
                No products yet.
              </p>
            ) : (
              data.map((product) => (
                <SingleProductCartView key={product.id} product={product} />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="most-popular">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((product) => (
              <SingleProductCartView key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new-items">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((product) => (
              <SingleProductCartView key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ProductsCollectionOne;
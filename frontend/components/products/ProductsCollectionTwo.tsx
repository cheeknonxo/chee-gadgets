import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import SingleProductCartView from "../product/SingleProductCartView";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/productDto";

const ProductsCollectionTwo = async () => {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  const data = rows.map(toProductDTO);

  return (
    <section className="max-w-screen-xl mx-auto py-16 px-4 md:px-8 w-full">
      <Tabs defaultValue="new-arrivals" className="w-full space-y-8 mx-0">
        <TabsList className="font-semibold bg-transparent w-full text-center">
          <TabsTrigger value="new-arrivals" className="md:text-xl">
            New Arrivals
          </TabsTrigger>
          <TabsTrigger value="best-sellers" className="md:text-xl">
            Best Sellers
          </TabsTrigger>
          <TabsTrigger value="feauted" className="md:text-xl">
            Featured
          </TabsTrigger>
        </TabsList>
        <TabsContent value="new-arrivals" className="w-full">
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
        <TabsContent value="best-sellers">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((product) => (
              <SingleProductCartView key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="feauted">
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

export default ProductsCollectionTwo;
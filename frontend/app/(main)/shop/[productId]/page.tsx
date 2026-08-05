import ProductGallery from "@/components/product/ProductGallery";
import React from "react";
import RelatedProducts from "@/components/products/RelatedProducts";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import ProductDetails from "@/components/product/ProductDetails";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/productDto";
import { notFound } from "next/navigation";

interface ProductIdPageProps {
  params: { productId: string };
}

const ProductIdPage = async ({ params }: ProductIdPageProps) => {
  const productRow = await prisma.product.findUnique({
    where: { id: params.productId },
  });

  if (!productRow) {
    notFound();
  }

  const product = toProductDTO(productRow);

  const relatedRows = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });
  const relatedProducts = relatedRows.map(toProductDTO);

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8 flex flex-col items-start gap-2 min-h-screen">
      <div className="my-2">
        <BreadcrumbComponent links={["/shop"]} pageText={product.name} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <ProductGallery isInModal={false} images={product.images} />
        <ProductDetails product={product} />
      </div>
      <RelatedProducts products={relatedProducts} />
    </div>
  );
};

export default ProductIdPage;
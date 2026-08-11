import ProductGallery from "@/components/product/ProductGallery";
import React from "react";
import RelatedProducts from "@/components/products/RelatedProducts";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import ProductDetails from "@/components/product/ProductDetails";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/productDto";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

interface ProductIdPageProps {
  params: { productId: string };
}

const ProductIdPage = async ({ params }: ProductIdPageProps) => {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const productRow = await prisma.product.findUnique({
    where: { id: params.productId },
  });

  if (!productRow) {
    notFound();
  }

  const reviewRows = await prisma.review.findMany({
    where: { productId: params.productId },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  const reviews = reviewRows.map((r) => ({
    author: r.author.name || "Anonymous",
    image: r.author.image || "",
    content: r.content,
    rating: r.rating,
    date: r.createdAt,
  }));

  let canReview = false;
  if (userId) {
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        productId: params.productId,
        order: { buyerId: userId },
      },
    });
    const alreadyReviewed = await prisma.review.findUnique({
      where: { productId_authorId: { productId: params.productId, authorId: userId } },
    });
    canReview = !!hasOrdered && !alreadyReviewed;
  }

  const product = { ...toProductDTO(productRow), reviews, canReview };

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
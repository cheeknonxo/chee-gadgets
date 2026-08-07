import BreadcrumbComponent from "@/components/others/Breadcrumb";
import EditProductForm from "@/components/dashboard/forms/EditProductForm";
import React from "react";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface EditProductPageProps {
  params: { productId: string };
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const product = await prisma.product.findUnique({
    where: { id: params.productId },
  });

  if (!product) {
    notFound();
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  if (product.sellerId !== userId && role !== "ADMIN") {
    redirect("/dashboard/products");
  }

  return (
    <div className="p-2 w-full">
      <BreadcrumbComponent links={["/dashboard", "/products"]} pageText="edit product" />
      <EditProductForm
        productId={product.id}
        initialData={{
          name: product.name,
          price: product.price.toString(),
          category: product.category,
          brand: product.brand || "",
          description: product.description,
          aboutItem: product.aboutItem.join("\n"),
          color: product.color.join(", "),
          discount: product.discount.toString(),
          stockItems: product.stockItems.toString(),
          images: product.images,
        }}
      />
    </div>
  );
};

export default EditProductPage;
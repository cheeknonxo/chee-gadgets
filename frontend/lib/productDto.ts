import type { Product as PrismaProduct } from "./generated/prisma/client";
import { Product } from "@/types";

export function toProductDTO(product: PrismaProduct): Product {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    aboutItem: product.aboutItem,
    price: Number(product.price),
    discount: product.discount,
    rating: product.rating,
    reviews: [],
    brand: product.brand ?? undefined,
    color: product.color,
    stockItems: product.stockItems,
    images: product.images,
  };
}
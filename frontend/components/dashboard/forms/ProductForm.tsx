"use client";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  aboutItem: z.string().optional(),
  color: z.string().optional(),
  discount: z.string().optional(),
  stockItems: z.string().min(1, "Stock quantity is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    setError("");

    if (!imageFiles || imageFiles.length === 0) {
      setError("Please select at least one image");
      return;
    }

    setSubmitting(true);

    const uploadFormData = new FormData();
    Array.from(imageFiles).forEach((file) => uploadFormData.append("images", file));

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadRes.ok) {
      const body = await uploadRes.json();
      setError(body.error || "Image upload failed");
      setSubmitting(false);
      return;
    }

    const { urls } = await uploadRes.json();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        aboutItem: data.aboutItem ? data.aboutItem.split("\n").filter(Boolean) : [],
        price: Number(data.price),
        discount: data.discount ? Number(data.discount) : 0,
        stockItems: Number(data.stockItems),
        brand: data.brand,
        category: data.category,
        color: data.color ? data.color.split(",").map((c) => c.trim()).filter(Boolean) : [],
        images: urls,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Something went wrong");
      return;
    }

    reset();
    setImageFiles(null);
    router.push("/dashboard/products");
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Add New Product
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
            Product Name
          </Label>
          <Input id="name" type="text" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("name")} />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <div>
          <Label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-white">
            Price (USD)
          </Label>
          <Input id="price" type="text" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("price")} />
          {errors.price && <span className="text-red-500">{errors.price.message}</span>}
        </div>

        <div>
          <Label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-white">
            Discount (%)
          </Label>
          <Input id="discount" type="text" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("discount")} />
          {errors.discount && <span className="text-red-500">{errors.discount.message}</span>}
        </div>

        <div>
          <Label htmlFor="stockItems" className="block text-sm font-medium text-gray-700 dark:text-white">
            Stock Quantity
          </Label>
          <Input id="stockItems" type="text" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("stockItems")} />
          {errors.stockItems && <span className="text-red-500">{errors.stockItems.message}</span>}
        </div>

        <div>
          <Label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-white">
            Category
          </Label>
          <Input id="category" type="text" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("category")} />
          {errors.category && <span className="text-red-500">{errors.category.message}</span>}
        </div>

        <div>
          <Label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-white">
            Brand
          </Label>
          <Input id="brand" type="text" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("brand")} />
          {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}
        </div>

        <div>
          <Label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-white">
            Available Colors (comma separated)
          </Label>
          <Input id="color" type="text" placeholder="black, white, blue" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("color")} />
          {errors.color && <span className="text-red-500">{errors.color.message}</span>}
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
            Description
          </Label>
          <textarea id="description" className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full border-gray-300 dark:border-gray-600" {...register("description")} />
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="aboutItem" className="block text-sm font-medium text-gray-700 dark:text-white">
            About Item (one bullet point per line)
          </Label>
          <textarea id="aboutItem" className="mt-1 border p-2 block w-full rounded-md dark:bg-slate-950 border-gray-300 dark:border-gray-600" {...register("aboutItem")} />
          {errors.aboutItem && <span className="text-red-500">{errors.aboutItem.message}</span>}
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-white">
            Product Images
          </Label>
          <p className="text-gray-500 text-sm mb-1">
            You can select multiple images. They&apos;ll be uploaded when you submit.
          </p>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600"
            onChange={(e) => setImageFiles(e.target.files)}
          />
        </div>

        {error && <p className="text-red-500 lg:col-span-2">{error}</p>}

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Uploading & Saving..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
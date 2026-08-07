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

interface EditProductFormProps {
  productId: string;
  initialData: {
    name: string;
    price: string;
    category: string;
    brand: string;
    description: string;
    aboutItem: string;
    color: string;
    discount: string;
    stockItems: string;
    images: string[];
  };
}

const EditProductForm = ({ productId, initialData }: EditProductFormProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>(initialData.images);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData.name,
      price: initialData.price,
      category: initialData.category,
      brand: initialData.brand,
      description: initialData.description,
      aboutItem: initialData.aboutItem,
      color: initialData.color,
      discount: initialData.discount,
      stockItems: initialData.stockItems,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setError("");
    setSubmitting(true);

    let finalImages = existingImages;

    if (imageFiles && imageFiles.length > 0) {
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
      finalImages = urls;
    }

    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
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
        images: finalImages,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Something went wrong");
      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Edit Product
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
          <Input id="color" type="text" className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600" {...register("color")} />
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
        </div>

        <div className="lg:col-span-2">
          <Label className="block text-sm font-medium text-gray-700 dark:text-white">
            Current Images
          </Label>
          <div className="flex gap-2 flex-wrap my-2">
            {existingImages.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-md border" />
            ))}
          </div>
          <Label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-white">
            Replace Images (optional)
          </Label>
          <p className="text-gray-500 text-sm mb-1">
            Leave empty to keep current images. Selecting new files replaces all of them.
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
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
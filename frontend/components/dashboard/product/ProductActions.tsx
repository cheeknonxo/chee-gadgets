"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductActions = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This can't be undone.")) {
      return;
    }
    setDeleting(true);
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      const body = await res.json();
      toast.error(body.error || "Failed to delete product");
      return;
    }

    toast.success("Product deleted");
    router.refresh();
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger className="">
          <div className="flex items-center justify-center hover:bg-slate-200 p-2 rounded-full dark:hover:bg-slate-900 duration-200">
            <MoreHorizontal />
          </div>
        </PopoverTrigger>
        <PopoverContent className="text-start">
          <Link
            href={`/shop/${productId}`}
            className="py-2 px-4 rounded-md w-full  block hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            View Product
          </Link>
          <Link
            href={`/dashboard/products/${productId}`}
            className="py-2 px-4 rounded-md w-full  block hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            Update Product
          </Link>
          <button
            disabled={deleting}
            onClick={handleDelete}
            className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProductActions;
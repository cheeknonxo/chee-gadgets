"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OrderActions = ({ orderId }: { orderId: string }) => {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);

    if (!res.ok) {
      const body = await res.json();
      toast.error(body.error || "Failed to update order");
      return;
    }

    toast.success("Order status updated");
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
            href={`/dashboard/orders/${orderId}`}
            className="py-2 px-4 rounded-md w-full  block hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            View Details
          </Link>
          <Select disabled={updating} onValueChange={updateStatus}>
            <SelectTrigger className="w-full text-base px-4 border-none outline-none focus:ring-offset-0 focus:ring-0 focus-within:outline-none hover:bg-slate-200 dark:hover:bg-slate-900">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <button
            disabled={updating}
            onClick={() => updateStatus("CANCELLED")}
            className="w-full text-start hover:bg-slate-200 dark:hover:bg-slate-900 py-2 px-4 rounded-md"
          >
            Cancel Order
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrderActions;
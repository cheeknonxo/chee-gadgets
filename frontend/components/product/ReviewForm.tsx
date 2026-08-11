"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ReviewForm = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (content.trim().length === 0) {
      toast.error("Please write a review");
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, content }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json();
      toast.error(body.error || "Failed to submit review");
      return;
    }

    toast.success("Review submitted");
    setRating(0);
    setContent("");
    router.refresh();
  };

  return (
    <div className="p-4 rounded-md shadow-md space-y-3 mb-4 border">
      <h3 className="font-semibold">Write a Review</h3>
      <div className="flex items-center gap-1">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <Star
              key={i}
              size={24}
              className={`cursor-pointer ${
                (hoverRating || rating) >= i + 1 ? "text-yellow-400" : "text-gray-400"
              }`}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i + 1)}
            />
          ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your experience with this product..."
        className="w-full border rounded-md p-2 bg-white dark:bg-slate-950 dark:border-gray-600"
        rows={3}
      />
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
};

export default ReviewForm;
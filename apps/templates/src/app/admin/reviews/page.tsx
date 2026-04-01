// STATUS: done
"use client";

import { useDeleteReview, useReviews } from "@features/reviews/api";
import {
  DeleteReviewDialog,
  ReviewCard,
  ReviewForm,
  ReviewSuccessDialog,
} from "@features/reviews/ui";
import { Button } from "@shared/components/ui/button";
import { Skeleton } from "@shared/components/ui/skeleton";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useTenantHref } from "@/shared/hooks/use-tenant-href";
import type { Review } from "@/shared/types/api";

export default function ReviewsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Review | null>(null);
  const [deleteItem, setDeleteItem] = useState<Review | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { href } = useTenantHref();
  const { completeModule } = useCompleteModule();
  const deleteReview = useDeleteReview();

  const { data: reviews = [], isLoading } = useReviews();

  const handleEdit = (item: Review) => {
    setEditItem(item);
    setShowForm(true);
  };
  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleSaved = async () => {
    setShowForm(false);
    setEditItem(null);
    setShowSuccess(true);

    toast.success("Review saved!");

    const wasCompleted = await completeModule(SiteSection.REVIEWS);
    if (wasCompleted) {
      toast.success("Module completed!");
      router.push(href("/admin"));
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await deleteReview.mutateAsync(deleteItem.id);
    setDeleteItem(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        {!showForm && (
          <Button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm font-semibold"
          >
            + Add reviews
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <ReviewForm
            item={editItem}
            onClose={() => {
              setShowForm(false);
              setEditItem(null);
            }}
            onSaved={handleSaved}
          />
        </div>
      )}

      {!showForm && (
        <>
          <div className="bg-blue-50/60 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-gray-500">
              You have {reviews.length} reviews.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={handleEdit}
                  onDelete={setDeleteItem}
                />
              ))}
              <div
                onClick={handleAdd}
                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors py-10"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">Add new review</p>
              </div>
            </div>
          )}
        </>
      )}

      {deleteItem && (
        <DeleteReviewDialog
          onCancel={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}

      {showSuccess && (
        <ReviewSuccessDialog onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
}

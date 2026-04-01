// STATUS: done
"use client";

import { useDeleteDesign, useDesigns } from "@features/designs/api";
import {
  DeleteDesignDialog,
  DesignCard,
  DesignForm,
  DesignSuccessDialog,
} from "@features/designs/ui";
import { Button } from "@shared/components/ui/button";
import { Skeleton } from "@shared/components/ui/skeleton";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useTenantHref } from "@/shared/hooks/use-tenant-href";
import type { Design } from "@/shared/types/api";

export default function DesignsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Design | null>(null);
  const [deleteItem, setDeleteItem] = useState<Design | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const { href } = useTenantHref();
  const { completeModule } = useCompleteModule();
  const deleteDesign = useDeleteDesign();
  const { data: items = [], isLoading } = useDesigns();

  const handleEdit = (item: Design) => {
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

    toast.success("Design saved!");

    const wasCompleted = await completeModule(SiteSection.DESIGNS);
    if (wasCompleted) {
      toast.success("Module completed!");
      router.push(href("/admin"));
    }
  };

  const handleDelete = async () => {
    if (!deleteItem?.id) return;

    await deleteDesign.mutateAsync(deleteItem.id);
    setDeleteItem(null);
    setShowSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Designs</h1>

        {!showForm && (
          <Button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm font-semibold"
          >
            + Add new
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <DesignForm
            item={editItem}
            onClose={() => {
              setShowForm(false);
              setEditItem(null);
            }}
            onSaved={() => void handleSaved()}
          />
        </div>
      )}

      {!showForm && (
        <>
          <div className="bg-blue-50/60 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-gray-500">
              You have {items.length} designs.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 flex flex-col items-center"
                >
                  <Skeleton className="w-40 h-48 rounded-[50%] mb-4" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full mb-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {items.map((item) => (
                <DesignCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={setDeleteItem}
                />
              ))}

              <div
                onClick={handleAdd}
                className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors min-h-80"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">Add new design</p>
              </div>
            </div>
          )}
        </>
      )}

      {deleteItem && (
        <DeleteDesignDialog
          designName={deleteItem.name ?? ""}
          onCancel={() => setDeleteItem(null)}
          onDelete={() => void handleDelete()}
        />
      )}

      {showSuccess && (
        <DesignSuccessDialog onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
}

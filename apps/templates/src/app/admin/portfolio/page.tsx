// STATUS: done

"use client";

import {
  useCreatePortfolio,
  useDeletePortfolio,
  usePortfolios,
  useUpdatePortfolio,
} from "@features/portfolio/api";
import {
  AddNewCard,
  DeleteArtworkDialog,
  PortfolioForm,
  PortfolioItemCard,
  PortfolioSuccessDialog,
} from "@features/portfolio/ui";
import { Button } from "@shared/components/ui/button";
import { Skeleton } from "@shared/components/ui/skeleton";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { useSiteMe } from "@shared/hooks/use-site";
import type { Portfolio } from "@shared/types/api";
import { Check, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useTenantHref } from "@/shared/hooks/use-tenant-href";

const MIN_ITEMS = 3;

export default function PortfolioPage() {
  const router = useRouter();
  const { href } = useTenantHref();
  const { data: siteMe } = useSiteMe();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Portfolio | null>(null);
  const [deleteItem, setDeleteItem] = useState<Portfolio | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const { data: portfolios = [], isLoading } = usePortfolios();
  const createPortfolio = useCreatePortfolio();
  const updatePortfolio = useUpdatePortfolio();
  const deletePortfolio = useDeletePortfolio();

  const { completeModule } = useCompleteModule();

  const canProceed = portfolios.length >= MIN_ITEMS;

  useEffect(() => {
    const complete = async () => {
      if (
        canProceed &&
        siteMe?.completed_modules &&
        !siteMe.completed_modules.includes("PORTFOLIO")
      ) {
        const wasCompleted = await completeModule(SiteSection.PORTFOLIO);
        if (wasCompleted) {
          toast.success("Module completed!");
          router.push(href("/admin"));
        }
      }
    };
    void complete();
  }, [canProceed, siteMe]);

  const handleEdit = (item: Portfolio) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditItem(null);
    toast.success("Portfolio item saved!");
  };

  const handleSave = async (data: {
    image: { image_url: string; image_public_id: string };
    price?: number;
    currency?: string;
    size?: number;
    size_unit?: string;
  }) => {
    if (editItem) {
      await updatePortfolio.mutateAsync({ id: editItem.id, ...data } as never);
    } else {
      await createPortfolio.mutateAsync(data as never);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await deletePortfolio.mutateAsync(deleteItem.id);
    setDeleteItem(null);
    setShowDeleteSuccess(true);
  };

  const isSaving = createPortfolio.isPending || updatePortfolio.isPending;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
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
          <PortfolioForm
            item={editItem}
            onClose={() => {
              setShowForm(false);
              setEditItem(null);
            }}
            onSaved={handleSaved}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      )}

      {!showForm && (
        <>
          <div
            className={`rounded-xl px-4 py-3 mb-6 flex items-center justify-between ${canProceed ? "bg-green-50" : "bg-blue-50/60"}`}
          >
            <div className="flex items-center gap-2">
              {canProceed ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Info className="w-4 h-4 text-blue-400" />
              )}
              <p className="text-sm text-gray-600">
                {canProceed
                  ? `You have ${portfolios.length} works in your portfolio.`
                  : `Add at least ${MIN_ITEMS} works to continue (${portfolios.length}/${MIN_ITEMS}).`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <Skeleton className="aspect-[4/5] rounded-xl mb-3" />
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {portfolios.map((item) => (
                <PortfolioItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={setDeleteItem}
                />
              ))}
              <AddNewCard onClick={handleAdd} />
            </div>
          )}

          {canProceed && (
            <div className="flex justify-center mt-8">
              <p className="text-sm text-green-600">
                {portfolios.length} works in portfolio
              </p>
            </div>
          )}
        </>
      )}

      {deleteItem && (
        <DeleteArtworkDialog
          onCancel={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}

      {showDeleteSuccess && (
        <PortfolioSuccessDialog onClose={() => setShowDeleteSuccess(false)} />
      )}
    </div>
  );
}

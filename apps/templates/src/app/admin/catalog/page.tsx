// STATUS: need testing full flow

"use client";

import {
  useCatalogs,
  useCreateCatalog,
  useDeleteCatalog,
  useUpdateCatalog,
} from "@features/catalog/api";
import {
  CatalogCard,
  CatalogForm,
  DeleteCatalogDialog,
  StripeConnectCard,
} from "@features/catalog/ui";
import { ModuleActivationPrompt } from "@shared/components/ModuleActivationPrompt";
import { ModuleToggle } from "@shared/components/ModuleToggle";
import { Button } from "@shared/components/ui/button";
import { Skeleton } from "@shared/components/ui/skeleton";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { useSiteMe } from "@shared/hooks/use-site";
import type { Catalog, CreateCatalogDto } from "@shared/types/api";
import { Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useTenantHref } from "@/shared/hooks/use-tenant-href";

export default function CatalogPage() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Catalog | null>(null);
  const [deleteItem, setDeleteItem] = useState<Catalog | null>(null);
  const [activated, setActivated] = useState(false);
  const router = useRouter();
  const { href } = useTenantHref();
  const { data: siteMe } = useSiteMe();
  const { completeModule } = useCompleteModule();

  const { data: items = [], isLoading } = useCatalogs();
  const createCatalog = useCreateCatalog();
  const updateCatalog = useUpdateCatalog();
  const deleteCatalog = useDeleteCatalog();

  const isSaving = createCatalog.isPending ?? updateCatalog.isPending;

  const handleEdit = (item: Catalog) => {
    setEditItem(item);
    setShowForm(true);
  };
  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleSave = async (data: CreateCatalogDto) => {
    if (editItem) {
      await updateCatalog.mutateAsync({ id: editItem.id, ...data });
    } else {
      await createCatalog.mutateAsync(data);
    }

    setShowForm(false);
    setEditItem(null);
    toast.success("Catalog item saved!");

    const wasCompleted = await completeModule(SiteSection.CATALOG);
    if (wasCompleted) {
      toast.success("Module completed!");
      router.push(href("/admin"));
    }
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteCatalog.mutate(deleteItem.id, {
      onSuccess: () => {
        setDeleteItem(null);
        toast.success("Catalog item deleted!");
      },
    });
  };

  const isOnboarding =
    siteMe?.owner_onboarding_status !== "ONBOARDING_COMPLETED";
  const alreadyCompleted = (siteMe?.completed_modules ?? []).includes(
    SiteSection.CATALOG,
  );
  const showPrompt =
    isOnboarding &&
    !alreadyCompleted &&
    !activated &&
    !isLoading &&
    items.length === 0 &&
    !showForm;

  if (showPrompt) {
    return (
      <ModuleActivationPrompt
        moduleKey={SiteSection.CATALOG}
        onActivate={() => setActivated(true)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Catalog</h1>
        {!showForm && (
          <Button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm font-semibold"
          >
            + Add new
          </Button>
        )}
      </div>
      <div className="mb-4">
        <ModuleToggle moduleKey={SiteSection.CATALOG} label="Catalog" />
      </div>

      <StripeConnectCard />

      {showForm && (
        <div className="mb-6">
          <CatalogForm
            item={editItem}
            onClose={() => {
              setShowForm(false);
              setEditItem(null);
            }}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      )}

      {!showForm && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                >
                  <Skeleton className="w-full aspect-[4/3]" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 flex-1 rounded-full" />
                      <Skeleton className="h-8 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                No products yet
              </p>
              <p className="text-xs text-gray-400 mb-5">
                Add your first product to start selling
              </p>
              <Button
                onClick={handleAdd}
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add product
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-400">
                  {items.length} product{items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <CatalogCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={setDeleteItem}
                  />
                ))}
                <div
                  onClick={handleAdd}
                  className="group bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 min-h-[240px]"
                >
                  <div className="w-11 h-11 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2.5 transition-colors">
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                    Add product
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {deleteItem && (
        <DeleteCatalogDialog
          itemName={deleteItem.name}
          onCancel={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

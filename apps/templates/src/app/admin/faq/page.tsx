// STATUS: done

"use client";

import {
  useCreateFaqCategory,
  useCreateFaqItem,
  useDeleteFaqCategory,
  useDeleteFaqItem,
  useFaqCategories,
  useUpdateFaqCategory,
  useUpdateFaqItem,
} from "@features/faq/api";
import { useSeedDefaultFaq } from "@features/faq/api/use-seed-default-faq";
import {
  DeleteFaqDialog,
  FaqCategorySection,
  FaqQuestionForm,
} from "@features/faq/ui";
import { Button } from "@shared/components/ui/button";
import { Progress } from "@shared/components/ui/progress";
import { Skeleton } from "@shared/components/ui/skeleton";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import type { FaqItem } from "@shared/types/api";
import { MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function FaqPage() {
  const { completeModule } = useCompleteModule();
  const router = useRouter();
  const { href } = useTenantHref();

  const { data: rawCategories = [], isLoading } = useFaqCategories();
  const createCategory = useCreateFaqCategory();
  const updateCategory = useUpdateFaqCategory();
  const deleteCategory = useDeleteFaqCategory();
  const createItem = useCreateFaqItem();
  const updateItem = useUpdateFaqItem();
  const deleteItem = useDeleteFaqItem();
  const seedDefaultFaq = useSeedDefaultFaq();

  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<FaqItem | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );

  const seededRef = useRef(false);
  useEffect(() => {
    if (!isLoading && rawCategories.length === 0 && !seededRef.current) {
      seededRef.current = true;
      seedDefaultFaq.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, rawCategories.length]);

  const categories = rawCategories;

  const MIN_SECTIONS = 3;
  const MIN_ANSWERS_PER_SECTION = 2;

  const categoriesLength = categories.length;
  const questionsLength = categories.reduce(
    (count, cat) => count + (cat.items?.length ?? 0),
    0,
  );

  const answeredCount = categories.reduce((count, cat) => {
    return (
      count +
      (cat.items ?? []).reduce(
        (qCount, q) => qCount + (q.answer?.trim() ? 1 : 0),
        0,
      )
    );
  }, 0);
  const totalCount = questionsLength;
  const pct =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  const sectionsWithEnoughAnswers = categories.filter(
    (cat) =>
      (cat.items ?? []).filter((q) => q.answer?.trim()).length >=
      MIN_ANSWERS_PER_SECTION,
  ).length;
  const isMinimumMet =
    categoriesLength >= MIN_SECTIONS &&
    sectionsWithEnoughAnswers >= MIN_SECTIONS;

  const handleUpdateCategory = async (
    id: string,
    data: Partial<{ title: string }>,
  ) => {
    await updateCategory.mutateAsync({ id, ...data });
  };

  async function handleAddQuestion(
    categoryId: string,
    formData: { question: string; answer: string },
  ) {
    await createItem.mutateAsync({
      category_id: categoryId,
      question: formData.question,
      answer: formData.answer || undefined,
      sort_order: 0,
    });
    setAddingToCategory(null);
  }

  const handleEditQuestion = async (id: string, data: { answer: string }) => {
    await updateItem.mutateAsync({ id, ...data });
  };

  const handleDeleteQuestion = async () => {
    if (!deletingItem) return;
    await deleteItem.mutateAsync(deletingItem.id);
    setDeletingItem(null);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    await deleteCategory.mutateAsync(deletingCategoryId);
    setDeletingCategoryId(null);
    toast.success("Category deleted");
  };

  const handleSave = async () => {
    if (!isMinimumMet) {
      toast.error(
        `Please fill at least ${MIN_ANSWERS_PER_SECTION} answers in ${MIN_SECTIONS} sections before saving.`,
      );
      return;
    }

    if (isMinimumMet) {
      const wasCompleted = await completeModule(SiteSection.FAQ);
      if (wasCompleted) {
        toast.success("Module completed!");
      }
    }

    router.push(href("/admin"));
  };

  async function handleAddCategory() {
    await createCategory.mutateAsync({
      title: "New Category",
      sort_order: categories.length + 1,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FAQ</h1>
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-blue-700">
            We&apos;ve put together basic questions that may be useful for your
            clients. You can edit category titles, delete questions you
            don&apos;t need, or add your own Q&As at any time.
          </p>
        </div>

        {!isLoading && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Answers filled
                </span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {answeredCount}/{totalCount}
              </span>
            </div>
            <Progress value={pct} className="h-2 [&>div]:bg-amber-400" />
            {/* Improvments here */}
            <p className="text-xs text-gray-500">
              {answeredCount === 0
                ? 'The more answers you add now, the fewer "Hey, is this normal?" DMs you\'ll get at 2 AM 😅'
                : answeredCount < 10
                  ? "Good start! Every answer you add = one less DM in your inbox. Your future self will thank you 🙏"
                  : answeredCount < totalCount
                    ? "You're on fire! 🔥 Keep going — your clients will love having all the info upfront."
                    : "All done! Your clients will barely need to message you now. Legend status 🏆"}
            </p>
            <div
              className={`flex items-center gap-2 pt-1 border-t ${isMinimumMet ? "border-green-100" : "border-amber-100"}`}
            >
              <span
                className={`text-xs font-medium ${isMinimumMet ? "text-green-600" : "text-amber-600"}`}
              >
                {isMinimumMet ? "Minimum requirement met" : "Minimum required"}:
              </span>
              <span className="text-xs text-gray-500">
                {sectionsWithEnoughAnswers}/{MIN_SECTIONS} sections with{" "}
                {MIN_ANSWERS_PER_SECTION}+ answers
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5">
                <Skeleton className="h-5 w-60 mb-3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <FaqCategorySection
                key={cat.id}
                category={cat}
                index={idx}
                onAddQuestion={(catId: string) => setAddingToCategory(catId)}
                onEditQuestion={handleEditQuestion}
                onDeleteQuestion={setDeletingItem}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={setDeletingCategoryId}
              />
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-300 rounded-lg gap-1 mt-2"
              onClick={handleAddCategory}
            >
              <Plus className="w-3.5 h-3.5" /> Add category
            </Button>
          </div>
        )}

        {!isLoading && (
          <>
            <p className="text-xs text-gray-400 mt-4">
              {categoriesLength} categories · {questionsLength} questions
            </p>
            <div className="flex flex-col items-center mt-6 gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-10 py-2.5 text-sm font-semibold"
                onClick={handleSave}
              >
                Back to dashboard
              </Button>
              <p className="text-xs text-gray-400">
                You can always come back and add more answers later
              </p>
            </div>
          </>
        )}
      </div>

      {addingToCategory && (
        <FaqQuestionForm
          categoryId={addingToCategory}
          onSave={handleAddQuestion}
          onCancel={() => setAddingToCategory(null)}
        />
      )}

      {deletingItem && (
        <DeleteFaqDialog
          onCancel={() => setDeletingItem(null)}
          onDelete={handleDeleteQuestion}
        />
      )}

      {deletingCategoryId && (
        <DeleteFaqDialog
          title="Delete this category?"
          onCancel={() => setDeletingCategoryId(null)}
          onDelete={() => void handleDeleteCategory()}
        />
      )}
    </div>
  );
}

// STATUS: done

"use client";

import { useDeleteEvent, useEvents } from "@features/events/api";
import {
  DeleteEventDialog,
  EventCard,
  EventForm,
  EventSuccessDialog,
} from "@features/events/ui";
import { Button } from "@shared/components/ui/button";
import { Skeleton } from "@shared/components/ui/skeleton";
import { SiteSection } from "@shared/constants/enums";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useTenantHref } from "@/shared/hooks/use-tenant-href";
import type { Event } from "@/shared/types/api";

export default function EventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Event | null>(null);
  const [deleteItem, setDeleteItem] = useState<Event | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const { href } = useTenantHref();
  const { completeModule } = useCompleteModule();
  const deleteEvent = useDeleteEvent();
  const { data: events = [], isLoading } = useEvents();

  const handleEdit = (item: Event) => {
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

    toast.success("Event saved!");

    const wasCompleted = await completeModule(SiteSection.EVENTS);
    if (wasCompleted) {
      toast.success("Module completed!");
      router.push(href("/admin"));
    }
  };

  const handleDelete = async () => {
    if (!deleteItem?.id) return;

    await deleteEvent.mutateAsync(deleteItem.id);
    setDeleteItem(null);
    setShowSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>

        {!showForm && (
          <Button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-sm font-semibold"
          >
            + Add new event
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <EventForm
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
              You have {events.length} events available.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
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
                <p className="text-sm text-gray-400">Add new event</p>
              </div>
            </div>
          )}
        </>
      )}

      {deleteItem && (
        <DeleteEventDialog
          onCancel={() => setDeleteItem(null)}
          onDelete={handleDelete}
        />
      )}

      {showSuccess && (
        <EventSuccessDialog onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
}

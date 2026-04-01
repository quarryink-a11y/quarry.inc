"use client";

import {
  useAdmins,
  useCreateAdmin,
  useDeleteAdmin,
  useUpdateAdmin,
} from "@features/admins/api/use-admins";
import type { AdminFormValues } from "@features/admins/model";
import {
  AdminCard,
  AdminForm,
  AdminSuccessDialog,
  DeleteAdminDialog,
} from "@features/admins/ui";
import { Button } from "@shared/components/ui/button";
import { Skeleton } from "@shared/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminItem {
  id: string | number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  phone_code?: string | null;
  phone_country_code?: string | null;
  phone_number?: string | null;
  role?: string;
  access_modules?: string[];
}

export function AdminsTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminItem | null>(null);
  const [deleting, setDeleting] = useState<AdminItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: admins = [], isLoading } = useAdmins();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (admin: AdminItem) => {
    setEditing(admin);
    setShowForm(true);
  };

  const handleSave = async (formData: AdminFormValues) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, repeat_password, ...data } = formData;
      if (editing) {
        await updateAdmin.mutateAsync({
          id: editing.id,
          ...(data as object),
        } as never);
      } else {
        await createAdmin.mutateAsync({
          ...(data as object),
          role: "ADMIN",
        } as never);
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      setShowForm(false);
      setEditing(null);
    } catch {
      toast.error("Failed to save admin");
    }
  };

  const handleDelete = async () => {
    if (deleting) {
      try {
        await deleteAdmin.mutateAsync(deleting.id as string);
        await queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
        setDeleting(null);
        setShowSuccess(true);
      } catch {
        toast.error("Failed to delete admin");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Admins</h2>
          <p className="text-sm text-gray-500">
            Manage your team members and their permissions
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 rounded-full px-5"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add admin
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Users className="w-4 h-4 text-blue-500" />
          <p className="font-semibold text-sm text-gray-900">
            Manage your team
          </p>
        </div>
        <p className="text-xs text-gray-500">
          Invite your assistant, manager, or anyone on your side.
          <br />
          Pick the sections they can edit and let everything run smoothly 😎
        </p>
      </div>

      {showForm && (
        <AdminForm
          admin={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => (
            <AdminCard
              key={admin.id}
              admin={admin}
              isOwner={(admin.role as string) === "OWNER"}
              onEdit={handleEdit as never}
              onDelete={setDeleting as never}
            />
          ))}

          {!showForm && (
            <button
              onClick={handleAdd}
              className="w-full bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl py-10 flex flex-col items-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">Add a new admin</p>
            </button>
          )}
        </div>
      )}

      {deleting && (
        <DeleteAdminDialog
          onCancel={() => setDeleting(null)}
          onDelete={handleDelete}
        />
      )}
      {showSuccess && (
        <AdminSuccessDialog onClose={() => setShowSuccess(false)} />
      )}
    </div>
  );
}

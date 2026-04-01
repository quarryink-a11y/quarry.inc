"use client";

import { Mail, Pencil, Phone, Trash2 } from "lucide-react";

import type { AdminItem } from "../model";

interface AdminCardProps {
  admin: AdminItem;
  isOwner: boolean;
  onEdit: (admin: AdminItem) => void;
  onDelete: (admin: AdminItem) => void;
}

export function AdminCard({
  admin,
  isOwner,
  onEdit,
  onDelete,
}: AdminCardProps) {
  const updatedAt = admin.updated_at ? new Date(admin.updated_at) : null;

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-5">
      <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-500" />
          <div className="w-14 h-8 bg-blue-500 rounded-t-full absolute -bottom-3 -left-2" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-base">
          {admin.first_name} {admin.last_name}
        </h3>

        <p className="text-sm text-gray-400">
          {admin.role ?? "Admin"}
          {!isOwner && updatedAt
            ? ` - recent activity: ${updatedAt.toLocaleDateString("en-GB")} ${updatedAt.toLocaleTimeString(
                "en-GB",
                { hour: "2-digit", minute: "2-digit" },
              )}`
            : ""}
        </p>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          <span>{admin.email}</span>
        </div>

        {admin.phone_number && (
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {admin.phone_code ?? "+1"} {admin.phone_number}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(admin)}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <Pencil className="w-4 h-4 text-gray-500" />
        </button>

        {!isOwner && (
          <button
            type="button"
            onClick={() => onDelete(admin)}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}

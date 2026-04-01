"use client";

import { Button } from "@shared/components/ui/button";
import { Info } from "lucide-react";

interface DeleteAdminDialogProps {
  onCancel: () => void;
  onDelete: () => void;
}

export function DeleteAdminDialog({
  onCancel,
  onDelete,
}: DeleteAdminDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Info className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          SAY GOODBYE TO THIS ADMIN?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Don&apos;t worry, you can always invite
          <br />
          them back later 🙌
        </p>
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 rounded-full px-8"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@shared/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteStepDialogProps {
  onCancel: () => void;
  onDelete: () => void;
}

export function DeleteStepDialog({
  onCancel,
  onDelete,
}: DeleteStepDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Delete step?</h3>
        <p className="text-sm text-gray-500 mb-5">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

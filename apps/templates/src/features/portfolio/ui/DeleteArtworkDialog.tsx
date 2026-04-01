"use client";

import { Button } from "@shared/components/ui/button";
import { Info } from "lucide-react";

interface DeleteArtworkDialogProps {
  onCancel: () => void;
  onDelete: () => void;
}

export function DeleteArtworkDialog({
  onCancel,
  onDelete,
}: DeleteArtworkDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Info className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          DELETE THIS ARTWORK?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Once deleted, it&apos;s gone from
          <br />
          your website 👋
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

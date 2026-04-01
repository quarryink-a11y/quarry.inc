"use client";

import { Plus } from "lucide-react";

interface AddNewCardProps {
  onClick: () => void;
}

export function AddNewCard({ onClick }: AddNewCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors min-h-[340px]"
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
        <Plus className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-sm text-gray-400">Add new work</p>
    </div>
  );
}

"use client";

import { useMediaUpload } from "@shared/hooks/use-media";
import { Loader2, Upload, X } from "lucide-react";
import { useRef } from "react";

interface InspirationUploaderProps {
  files: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function InspirationUploader({
  files,
  onChange,
  maxFiles = 3,
}: InspirationUploaderProps) {
  const upload = useMediaUpload();

  const handleUpload = async (index: number, file: File) => {
    const result = await upload.mutateAsync(file);
    const newFiles = [...files];
    newFiles[index] = result.url;
    onChange(newFiles.filter(Boolean));
  };

  const handleRemove = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const slots = Array.from({ length: maxFiles }, (_, i) => files[i] || null);

  return (
    <div className="grid grid-cols-3 gap-3">
      {slots.map((url, i) => (
        <UploadSlot
          key={i}
          url={url}
          uploading={upload.isPending}
          onUpload={(file) =>
            handleUpload(files.length > i ? i : files.length, file)
          }
          onRemove={() => handleRemove(i)}
        />
      ))}
    </div>
  );
}

interface UploadSlotProps {
  url: string | null;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function UploadSlot({ url, uploading, onUpload, onRemove }: UploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  if (url) {
    return (
      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group">
        <img src={url} alt="" className="w-full h-full object-cover" />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50/50"
    >
      {uploading ? (
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      ) : (
        <>
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <p className="text-xs text-gray-500">
            Drag & drop or <span className="underline font-medium">Browse</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP, PDF</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
    </div>
  );
}

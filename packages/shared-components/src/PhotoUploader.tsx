"use client";

import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";

export interface PhotoValue {
  publicId: string;
  imageUrl: string;
}

interface PhotoUploaderProps {
  imageUrl?: string;
  publicId?: string;
  onUpload: (file: File) => Promise<PhotoValue>;
  onDelete?: (publicId: string) => Promise<void>;
  onChange?: (value: PhotoValue | null) => void;
  /** Render prop for the button wrapper — lets each app pass its own Button component. */
  renderButton?: (props: {
    variant?: "default" | "outline";
    size?: "sm";
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    children: ReactNode;
  }) => ReactNode;
}

function DefaultButton(props: {
  variant?: "default" | "outline";
  size?: "sm";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={props.className}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function PhotoUploader({
  imageUrl,
  publicId,
  onUpload,
  onDelete,
  onChange,
  renderButton,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const Btn = renderButton ?? DefaultButton;

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await onUpload(file);
      onChange?.(result);
    } catch (err) {
      console.error("Photo upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!publicId && !onDelete) {
      onChange?.(null);
      return;
    }

    setDeleting(true);
    try {
      if (publicId && onDelete) {
        await onDelete(publicId);
      }
      onChange?.(null);
    } catch (err) {
      console.error("Photo delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30 p-6">
        {imageUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={imageUrl}
              alt=""
              className="max-h-52 rounded-lg object-cover mb-3"
            />
            <div className="flex gap-2">
              <label className="cursor-pointer">
                {Btn({
                  variant: "outline",
                  size: "sm",
                  className: "rounded-full",
                  children: (
                    <span>
                      <Pencil className="w-3.5 h-3.5 mr-1.5 inline" />
                      Replace
                    </span>
                  ),
                })}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </label>
              {Btn({
                variant: "outline",
                size: "sm",
                className:
                  "rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200",
                onClick: handleDelete,
                disabled: deleting,
                children: (
                  <>
                    <Trash2 className="w-3.5 h-3.5 mr-1.5 inline" />
                    {deleting ? "Deleting..." : "Delete"}
                  </>
                ),
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <ImageIcon className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-xs text-gray-400 text-center mb-1">
              Allowed formats: JPG, PNG, WEBP
            </p>
            <p className="text-xs text-gray-400 text-center mb-1">
              Max size: 10 MB
            </p>
            <p className="text-xs text-gray-400 text-center mb-3">
              Recommended resolution: at least 1200x1200 px
            </p>
            <label className="cursor-pointer">
              {Btn({
                size: "sm",
                className:
                  "bg-blue-500 hover:bg-blue-600 rounded-full px-6 text-white",
                children: (
                  <span>{uploading ? "Uploading..." : "+ Upload a photo"}</span>
                ),
              })}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

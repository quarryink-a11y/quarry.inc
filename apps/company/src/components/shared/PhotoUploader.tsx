"use client";

import type { components } from "@quarry/api-types";
import {
  PhotoUploader as SharedPhotoUploader,
  type PhotoValue,
} from "@quarry/shared-components";

export type { PhotoValue };
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type MediaUploadResponse = components["schemas"]["MediaUploadResponseDto"];

interface PhotoUploaderProps {
  imageUrl?: string;
  publicId?: string;
  onChange?: (value: PhotoValue | null) => void;
}

function renderButton(props: {
  variant?: "default" | "outline";
  size?: "sm";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  const { children, onClick, ...rest } = props;
  if (onClick) {
    return (
      <Button {...rest} onClick={onClick}>
        {children}
      </Button>
    );
  }
  return (
    <Button {...rest} asChild>
      <span>{children}</span>
    </Button>
  );
}

export function PhotoUploader({
  imageUrl,
  publicId,
  onChange,
}: PhotoUploaderProps) {
  const handleUpload = async (file: File): Promise<PhotoValue> => {
    const formData = new FormData();
    formData.append("files", file);

    const res = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(err?.message ?? "Upload failed");
    }

    const data = (await res.json()) as MediaUploadResponse[];
    const item = data[0];
    return { publicId: item.publicId, imageUrl: item.url };
  };

  const handleDelete = async (id: string): Promise<void> => {
    const res = await fetch(`/api/media?publicId=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(err?.message ?? "Delete failed");
    }
  };

  return (
    <SharedPhotoUploader
      imageUrl={imageUrl}
      publicId={publicId}
      onUpload={handleUpload}
      onDelete={handleDelete}
      onChange={onChange}
      renderButton={renderButton}
    />
  );
}

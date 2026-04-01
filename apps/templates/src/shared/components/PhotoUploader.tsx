"use client";

import {
  PhotoUploader as SharedPhotoUploader,
  type PhotoValue,
} from "@quarry/shared-components";
import { Button } from "@shared/components/ui/button";
import { useMediaDelete, useMediaUpload } from "@shared/hooks/use-media";
import type { ReactNode } from "react";

export type { PhotoValue } from "@quarry/shared-components";

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
  const upload = useMediaUpload();
  const deleteMutation = useMediaDelete();

  const handleUpload = async (file: File): Promise<PhotoValue> => {
    const result = await upload.mutateAsync(file);
    return { publicId: result.publicId, imageUrl: result.url };
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteMutation.mutateAsync(id);
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

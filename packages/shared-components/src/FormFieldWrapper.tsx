import type { ReactNode } from "react";

import { cn } from "./lib/cn";

interface FormFieldWrapperProps {
  label?: ReactNode;
  error?: string;
  required?: boolean;
  styles?: {
    root?: string;
    label?: string;
    error?: string;
  };
  children: ReactNode;
}

export function FormFieldWrapper({
  label,
  error,
  required,
  styles,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", styles?.root)}>
      {label && (
        <div className={cn("text-sm text-gray-500", styles?.label)}>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </div>
      )}

      {children}

      {error && (
        <div className={cn("text-xs text-red-500", styles?.error)}>{error}</div>
      )}
    </div>
  );
}

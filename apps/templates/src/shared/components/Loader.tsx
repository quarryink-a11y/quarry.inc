import { Loader2 } from "lucide-react";

interface LoaderProps {
  styles?: {
    root?: string;
    icon?: string;
  };
}
export function Loader({ styles }: LoaderProps) {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50/80 ${styles?.root}`}
    >
      <Loader2
        className={`h-6 w-6 animate-spin text-blue-500 ${styles?.icon}`}
      />
    </div>
  );
}

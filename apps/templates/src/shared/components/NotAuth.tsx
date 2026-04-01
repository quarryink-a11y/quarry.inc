import { ShieldX } from "lucide-react";

export function NotAuth() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/80">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-gray-500">
          You don&apos;t have permission to access this site&apos;s admin panel.
        </p>
      </div>
    </div>
  );
}

// STATUS: done

"use client";

import { Sheet, SheetContent, SheetTrigger } from "@shared/components/ui/sheet";
import { useSiteMe } from "@shared/hooks/use-site";
import { useAuth } from "@shared/providers/AuthProvider";
import { Menu } from "lucide-react";
import { useState } from "react";

import { AdminSidebar } from "@/shared/components/AdminSidebar";
import { Loader } from "@/shared/components/Loader";
import { NotAuth } from "@/shared/components/NotAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { data: siteMe, isLoading: siteLoading } = useSiteMe();

  const isLoading = authLoading || siteLoading;

  if (isLoading) {
    return <Loader />;
  }

  if (
    !isAuthenticated ||
    siteMe?.onboarding_status !== "ONBOARDING_COMPLETED"
  ) {
    return <NotAuth />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50/80">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-50">
        <AdminSidebar />
      </div>

      {/* Mobile header + sheet sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-56">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-gray-800">Quarry.ink</span>
      </div>

      <main className="flex-1 overflow-auto md:pt-0 pt-14">{children}</main>
    </div>
  );
}

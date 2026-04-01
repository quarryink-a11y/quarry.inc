"use client";

import { useSiteSettings } from "@shared/hooks/use-site-settings";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Palette,
  Settings,
  ShoppingBag,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "../providers/AuthProvider";

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  /** Only visible if site_sections[key] is truthy */
  optionalModule?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: "DASHBOARD", label: "Dashboard", icon: LayoutGrid, href: "/admin" },
  { key: "ABOUT", label: "About", icon: FileText, href: "/admin/about-me" },
  {
    key: "HOW_TO_BOOK",
    label: "How to Book",
    icon: ClipboardList,
    href: "/admin/how-to-book",
  },
  {
    key: "PORTFOLIO",
    label: "Portfolio",
    icon: Briefcase,
    href: "/admin/portfolio",
  },
  {
    key: "DESIGNS",
    label: "Designs",
    icon: Palette,
    href: "/admin/designs",
    optionalModule: true,
  },
  {
    key: "CATALOG",
    label: "Catalog",
    icon: ShoppingBag,
    href: "/admin/catalog",
    optionalModule: true,
  },
  {
    key: "EVENTS",
    label: "Events",
    icon: CalendarDays,
    href: "/admin/events",
    optionalModule: true,
  },
  {
    key: "REVIEWS",
    label: "Reviews",
    icon: Star,
    href: "/admin/reviews",
    optionalModule: true,
  },
  { key: "FAQ", label: "FAQ", icon: HelpCircle, href: "/admin/faq" },
  {
    key: "ANALYTICS",
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { data: siteSettings } = useSiteSettings();
  const { href } = useTenantHref();
  const logoUrl = siteSettings?.logo_url;

  const siteSections = siteSettings?.site_sections;

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.optionalModule) {
      return !!siteSections?.[item.key as keyof typeof siteSections];
    }
    return true;
  });
  return (
    <aside className="w-56 min-h-screen fixed bg-white border-r border-gray-100 flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-8 h-8 rounded-lg object-contain"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Q</span>
          </div>
        )}
        <span className="font-semibold text-gray-800 text-lg">Quarry.ink</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {visibleItems.map((item) => {
          const fullHref = href(item.href);
          const isActive =
            item.href === "/admin"
              ? pathname === fullHref
              : pathname.startsWith(fullHref);

          return (
            <Link
              key={item.key}
              href={fullHref}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <item.icon
                className="w-4.5 h-4.5"
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="flex flex-col gap-1 pt-4 border-t border-gray-100 mt-2">
        <Link
          href={href("/admin/settings")}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            pathname.startsWith(href("/admin/settings"))
              ? "bg-blue-500 text-white shadow-md shadow-blue-200"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          <Settings
            className="w-4.5 h-4.5"
            strokeWidth={
              pathname.startsWith(href("/admin/settings")) ? 2.2 : 1.8
            }
          />
          Settings
        </Link>
        <button
          onClick={logout}
          className="cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full"
        >
          <LogOut className="w-4.5 h-4.5" strokeWidth={1.8} />
          Log out
        </button>
      </div>
    </aside>
  );
}

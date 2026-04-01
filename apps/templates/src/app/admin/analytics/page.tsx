// STATUS: done, but latter need refactor, because of too much logic in page component

"use client";

import { useAnalyticsDashboard } from "@features/analytics/api/use-analytics-dashboard";
import {
  ClientInsights,
  InquiriesChart,
  InquiriesList,
  OrdersChart,
  PeriodSelector,
  ReferralSourcesChart,
  SourceConversionTable,
  StatCard,
  TrafficSourcesChart,
} from "@features/analytics/ui";
import { useInquiries } from "@features/inquiries/api/use-inquiries";
import { Button } from "@shared/components/ui/button";
import { Skeleton } from "@shared/components/ui/skeleton";
import { Switch } from "@shared/components/ui/switch";
import { InquiryStatus, OrderStatus } from "@shared/constants/enums";
import { useSiteMe } from "@shared/hooks/use-site";
import {
  useSiteSettings,
  useUpdateSiteSettings,
} from "@shared/hooks/use-site-settings";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  ClipboardList,
  DollarSign,
  Eye,
  Info,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const defaultClientInsights = {
  total_clients: 0,
  new_clients: 0,
  returning_clients: 0,
  return_rate: 0,
  top_returning: [],
};

function InquiriesTab() {
  const queryClient = useQueryClient();
  const { data: rawInquiries, isLoading } = useInquiries();
  const inquiries = rawInquiries ?? [];

  return (
    <InquiriesList
      inquiries={inquiries}
      isLoading={isLoading}
      onDelete={() => {
        void queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      }}
    />
  );
}

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "sources", label: "Sources & Clients", icon: Users },
  { id: "inquiries", label: "Inquiries", icon: ClipboardList },
] as const;

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [periodDays, setPeriodDays] = useState(30);
  const { data: siteMe } = useSiteMe();
  const { data: siteSettings } = useSiteSettings();
  const { mutate: updateSiteSettings, isPending: togglingAnalytics } =
    useUpdateSiteSettings();
  const { href } = useTenantHref();
  const isOnboardingComplete =
    siteMe?.onboarding_status === "ONBOARDING_COMPLETED";

  const { data: dashboard, isLoading } = useAnalyticsDashboard(periodDays);

  const uniqueVisitors = dashboard?.visits.unique_visitors ?? 0;
  const totalInquiries = dashboard?.inquiries.total ?? 0;
  const totalRevenue = dashboard?.orders.revenue ?? 0;

  const completedInquiries = useMemo(() => {
    const byStatus = dashboard?.inquiries.by_status ?? [];
    return (
      byStatus.find((s) => s.status === InquiryStatus.COMPLETED)?.count ?? 0
    );
  }, [dashboard]);

  const inquiryConversionRate =
    totalInquiries > 0
      ? ((completedInquiries / totalInquiries) * 100).toFixed(1)
      : "0.0";
  const conversionRate =
    uniqueVisitors > 0
      ? ((totalInquiries / uniqueVisitors) * 100).toFixed(1)
      : "0.0";

  const paidOrdersCount = useMemo(() => {
    const byStatus = dashboard?.orders.by_status ?? [];
    return byStatus.find((s) => s.status === OrderStatus.PAID)?.count ?? 0;
  }, [dashboard]);

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {!isOnboardingComplete && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700 font-medium mb-1">
                  Welcome to Analytics
                </p>
                <p className="text-sm text-gray-500">
                  Here you can track the number of inquiries received on your
                  site, orders, and earnings.
                </p>
                <Link href={href("/admin")}>
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600 rounded-xl gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!siteSettings?.analytics_enabled}
                onCheckedChange={(checked) =>
                  updateSiteSettings({ analytics_enabled: checked })
                }
                disabled={togglingAnalytics}
              />
              <span className="text-sm text-gray-500">
                {siteSettings?.analytics_enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
          {(activeTab === "overview" || activeTab === "sources") && (
            <PeriodSelector selected={periodDays} onChange={setPeriodDays} />
          )}
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Traffic & Conversion
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard
                      label="Visitors"
                      value={uniqueVisitors}
                      icon={Eye}
                      color="blue"
                      subtitle="Unique"
                    />
                    <StatCard
                      label="Inquiries"
                      value={totalInquiries}
                      icon={MessageSquare}
                      color="purple"
                      subtitle="Received"
                    />
                    <StatCard
                      label="Visit → Inquiry"
                      value={`${conversionRate}%`}
                      icon={TrendingUp}
                      color="green"
                      subtitle="Conversion"
                    />
                    <StatCard
                      label="Inquiry → Book"
                      value={`${inquiryConversionRate}%`}
                      icon={TrendingUp}
                      color="purple"
                      subtitle="Conversion"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 mt-5">
                    Revenue & Orders
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard
                      label="Revenue"
                      value={`$${totalRevenue.toLocaleString()}`}
                      icon={DollarSign}
                      color="green"
                      subtitle="Total"
                    />
                    <StatCard
                      label="Paid Orders"
                      value={paidOrdersCount}
                      icon={ShoppingBag}
                      color="orange"
                      subtitle="Completed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <InquiriesChart data={dashboard?.inquiries.by_date ?? []} />
                  <OrdersChart data={dashboard?.orders.by_date ?? []} />
                </div>
                <TrafficSourcesChart data={dashboard?.visits.by_source ?? []} />
              </>
            )}
          </>
        )}

        {activeTab === "sources" && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <Skeleton className="h-48 w-full" />
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <ReferralSourcesChart
                    data={dashboard?.referral_sources ?? []}
                  />
                  <ClientInsights
                    data={dashboard?.client_insights ?? defaultClientInsights}
                  />
                </div>
                <SourceConversionTable
                  data={dashboard?.source_conversions ?? []}
                />
              </>
            )}
          </>
        )}

        {activeTab === "inquiries" && <InquiriesTab />}
      </div>
    </div>
  );
}

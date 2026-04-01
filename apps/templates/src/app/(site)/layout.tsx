import { fetchTenant } from "@shared/lib/fetch-tenant";
import { notFound } from "next/navigation";

import { TenantDataProvider } from "@/shared/providers/TenantProvider";

import { ClientWrapper } from "./client-wrapper";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await fetchTenant();

  if (!tenant?.kind) {
    notFound();
  }

  return (
    <TenantDataProvider data={tenant}>
      <ClientWrapper />
      {children}
    </TenantDataProvider>
  );
}

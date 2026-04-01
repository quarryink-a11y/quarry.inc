import { fetchTenant } from "@shared/lib/fetch-tenant";
import { TenantDataProvider } from "@shared/providers/TenantProvider";
import { notFound } from "next/navigation";

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await fetchTenant();
  if (!tenant?.kind) notFound();
  return <TenantDataProvider data={tenant}>{children}</TenantDataProvider>;
}

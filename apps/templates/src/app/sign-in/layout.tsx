import { fetchTenant } from "@shared/lib/fetch-tenant";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const tenantHost = h.get("x-tenant-host");

  // Slug or custom domain — validate tenant exists
  if (tenantHost) {
    const tenant = await fetchTenant();
    if (!tenant) notFound();
  }

  // Platform without slug — render sign-in without tenant context
  return <>{children}</>;
}

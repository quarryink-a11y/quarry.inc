import { templateRegistry } from "@shared/components/tenant-templates/registry";
import { fetchTenant, fetchTenantContent } from "@shared/lib/fetch-tenant";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await fetchTenant();
  if (!tenant?.kind) return {};

  const entry = templateRegistry[tenant.kind];
  return entry?.metadata ?? {};
}

export default async function SitePage() {
  const tenant = await fetchTenant();

  if (!tenant?.kind) notFound();

  const entry = templateRegistry[tenant.kind];
  if (!entry) notFound();

  const [TemplateApp, content] = await Promise.all([
    entry.load(),
    fetchTenantContent(),
  ]);

  return (
    <div id="multitenant-app-root">
      <TemplateApp content={content ?? null} isPreview={false} />
    </div>
  );
}

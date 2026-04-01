import { templateRegistry } from "@shared/components/tenant-templates/registry";
import { fetchTenant, fetchTenantDraftContent } from "@shared/lib/fetch-tenant";
import { notFound } from "next/navigation";

export default async function PreviewPage() {
  const tenant = await fetchTenant();
  if (!tenant?.kind) notFound();

  const entry = templateRegistry[tenant.kind];
  if (!entry) notFound();

  const [TemplateApp, content] = await Promise.all([
    entry.load(),
    fetchTenantDraftContent(),
  ]);

  return (
    <div id="multitenant-app-root">
      <TemplateApp content={content ?? null} isPreview />
    </div>
  );
}

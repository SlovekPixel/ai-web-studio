"use client";

import { AppShell } from "@/components/layout/app-shell";
import { QueryState } from "@/components/shared/query-state";
import { ComfyUiIntegrationCard } from "@/features/integrations/components/comfyui-integration-card";
import { useMe } from "@/features/users/hooks/use-me";

export default function ComfyUiPage() {
  const me = useMe();
  const hasOrganization = Boolean(me.data?.orgId);
  const isOrgOwner = Boolean(me.data?.isOrgOwner);

  return (
    <AppShell
      title="ComfyUI"
      description="Подключение организации к ComfyUI"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data ? (
            hasOrganization ? (
              <ComfyUiIntegrationCard isOrgOwner={isOrgOwner} />
            ) : (
              <p className="text-sm text-muted-foreground">
                ComfyUI доступен только пользователям организации.
              </p>
            )
          ) : null}
        </QueryState>
      </div>
    </AppShell>
  );
}

"use client";

import { AppShell } from "@/components/layout/app-shell";
import { OrganizationDetails } from "@/features/organizations/components/organization-details";
import { OrganizationEmptyState } from "@/features/organizations/components/organization-empty-state";
import { QueryState } from "@/components/shared/query-state";
import { useMe } from "@/features/users/hooks/use-me";

export default function OrganizationsPage() {
  const me = useMe();
  const canEditAsAdmin = Boolean(me.data?.isAdmin);

  return (
    <AppShell
      title="Моя организация"
      description="Данные организации текущего пользователя"
    >
      <div className="mx-auto w-full max-w-4xl">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data?.organization ? (
            <OrganizationDetails
              organization={me.data.organization}
              showEdit={canEditAsAdmin}
            />
          ) : me.data ? (
            <OrganizationEmptyState />
          ) : null}
        </QueryState>
      </div>
    </AppShell>
  );
}

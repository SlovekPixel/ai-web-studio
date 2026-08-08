"use client";

import { AdminGuard } from "@/features/admin/components/admin-guard";
import { AppShell } from "@/components/layout/app-shell";
import { OrganizationForm } from "@/features/organizations/components/organization-form";
import { QueryState } from "@/components/shared/query-state";
import { useMe } from "@/features/users/hooks/use-me";
import { useUsers } from "@/features/users/hooks/use-users";

export default function AdminNewOrganizationPage() {
  const me = useMe();
  const users = useUsers(Boolean(me.data?.isAdmin));

  const ownerCandidates =
    users.data?.filter(
      (user) => user.orgId === null && user.id !== me.data?.id,
    ) ?? [];

  return (
    <AppShell
      title="Создание организации"
      description="Новая организация появится в общем списке"
    >
      <AdminGuard>
        <div className="mx-auto w-full max-w-2xl">
          <QueryState
            isLoading={me.isLoading || users.isLoading}
            error={me.error ?? users.error}
          >
            {me.data ? (
              <OrganizationForm
                mode="create"
                ownerCandidates={ownerCandidates}
                redirectTo="/admin/organizations"
                invalidateOrganizations
              />
            ) : null}
          </QueryState>
        </div>
      </AdminGuard>
    </AppShell>
  );
}

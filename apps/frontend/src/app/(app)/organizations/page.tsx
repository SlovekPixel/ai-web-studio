"use client";

import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { OrganizationDetails } from "@/features/organizations/components/organization-details";
import { OrganizationEmptyState } from "@/features/organizations/components/organization-empty-state";
import { QueryState } from "@/components/shared/query-state";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/users/hooks/use-me";

export default function OrganizationsPage() {
  const me = useMe();
  const canManageAsAdmin = Boolean(me.data && me.data.orgId === null);

  return (
    <AppShell
      title="Моя организация"
      description="Данные организации текущего пользователя"
      actions={
        canManageAsAdmin ? (
          <Button render={<Link href="/organizations/new" />}>Создать</Button>
        ) : null
      }
    >
      <div className="mx-auto w-full max-w-4xl">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data?.organization ? (
            <OrganizationDetails
              organization={me.data.organization}
              showEdit={canManageAsAdmin}
            />
          ) : me.data ? (
            <OrganizationEmptyState canCreate={canManageAsAdmin} />
          ) : null}
        </QueryState>
      </div>
    </AppShell>
  );
}

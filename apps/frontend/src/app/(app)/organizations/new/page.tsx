"use client";

import { AppShell } from "@/components/layout/app-shell";
import { OrganizationForm } from "@/features/organizations/components/organization-form";
import { QueryState } from "@/components/shared/query-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMe } from "@/features/users/hooks/use-me";

export default function NewOrganizationPage() {
  const me = useMe();

  return (
    <AppShell
      title="Создание организации"
      description="Новая организация с вами в роли владельца"
    >
      <div className="mx-auto w-full max-w-2xl">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data?.orgId ? (
            <Alert>
              <AlertTitle>Организация уже назначена</AlertTitle>
              <AlertDescription>
                Создание доступно только пользователям без организации.
              </AlertDescription>
            </Alert>
          ) : me.data ? (
            <OrganizationForm mode="create" ownerId={me.data.id} />
          ) : null}
        </QueryState>
      </div>
    </AppShell>
  );
}

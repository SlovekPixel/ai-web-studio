"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { QueryState } from "@/components/shared/query-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { organizationsApi } from "@/features/organizations/api";
import { OrganizationForm } from "@/features/organizations/components/organization-form";
import { useMe } from "@/features/users/hooks/use-me";

export default function EditOrganizationPage() {
  const params = useParams<{ uuid: string }>();
  const me = useMe();
  const canEditAsAdmin = Boolean(me.data?.isAdmin);

  const organizationQuery = useQuery({
    queryKey: ["organizations", params.uuid],
    queryFn: () => organizationsApi.getByUuid(params.uuid),
    enabled: Boolean(params.uuid) && canEditAsAdmin,
  });

  return (
    <AppShell
      title="Редактирование организации"
      description="Изменение названия и описания"
    >
      <div className="mx-auto w-full max-w-2xl">
        {!me.isLoading && me.data && !canEditAsAdmin ? (
          <Alert variant="destructive">
            <AlertTitle>Недостаточно прав</AlertTitle>
            <AlertDescription>
              Редактирование организаций доступно только администраторам.
            </AlertDescription>
          </Alert>
        ) : (
          <QueryState
            isLoading={me.isLoading || organizationQuery.isLoading}
            error={me.error ?? organizationQuery.error}
          >
            {organizationQuery.data ? (
              <OrganizationForm organization={organizationQuery.data} />
            ) : null}
          </QueryState>
        )}
      </div>
    </AppShell>
  );
}

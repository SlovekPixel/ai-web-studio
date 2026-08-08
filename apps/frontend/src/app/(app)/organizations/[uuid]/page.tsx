"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { QueryState } from "@/components/shared/query-state";
import { organizationsApi } from "@/features/organizations/api";
import { OrganizationDetails } from "@/features/organizations/components/organization-details";
import { useMe } from "@/features/users/hooks/use-me";

export default function OrganizationByUuidPage() {
  const params = useParams<{ uuid: string }>();
  const me = useMe();
  const canFetchAsAdmin = Boolean(me.data && me.data.orgId === null);

  const organizationFromMe =
    me.data?.organization?.uuid === params.uuid ? me.data.organization : null;

  const organizationQuery = useQuery({
    queryKey: ["organizations", params.uuid],
    queryFn: () => organizationsApi.getByUuid(params.uuid),
    enabled: Boolean(params.uuid) && canFetchAsAdmin && !organizationFromMe,
  });

  const organization = organizationFromMe ?? organizationQuery.data;
  const isLoading =
    me.isLoading || (!organizationFromMe && organizationQuery.isLoading);
  const error =
    me.error ?? (!organizationFromMe ? organizationQuery.error : null);

  return (
    <AppShell title="Организация" description="Карточка организации">
      <div className="mx-auto w-full max-w-4xl">
        <QueryState isLoading={isLoading} error={error}>
          {organization ? (
            <OrganizationDetails
              organization={organization}
              showEdit={canFetchAsAdmin}
            />
          ) : (
            <QueryState
              isLoading={false}
              error={new Error("Организация не найдена или недоступна")}
            >
              {null}
            </QueryState>
          )}
        </QueryState>
      </div>
    </AppShell>
  );
}

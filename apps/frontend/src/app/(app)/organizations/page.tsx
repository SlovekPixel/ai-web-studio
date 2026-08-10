"use client";

import { AppShell } from "@/components/layout/app-shell";
import { QueryState } from "@/components/shared/query-state";
import { CreateMemberInviteCard } from "@/features/organizations/components/create-member-invite-card";
import { OrganizationDetails } from "@/features/organizations/components/organization-details";
import { OrganizationEmptyState } from "@/features/organizations/components/organization-empty-state";
import { OrganizationMembersTable } from "@/features/organizations/components/organization-members-table";
import { useOrganizationMembers } from "@/features/organizations/hooks/use-organization-members";
import { useMe } from "@/features/users/hooks/use-me";

export default function OrganizationsPage() {
  const me = useMe();
  const canEditAsAdmin = Boolean(me.data?.isAdmin);
  const canInviteMembers = Boolean(me.data?.isOrgOwner);
  const hasOrganization = Boolean(me.data?.organization);
  const members = useOrganizationMembers(hasOrganization);

  return (
    <AppShell
      title="Моя организация"
      description="Данные организации текущего пользователя"
    >
      <div className="w-full">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data?.organization ? (
            <div className="grid w-full gap-6 lg:grid-cols-2 lg:items-start">
              <div className="flex min-w-0 flex-col gap-6">
                {canInviteMembers ? <CreateMemberInviteCard /> : null}
                <OrganizationDetails
                  organization={me.data.organization}
                  showEdit={canEditAsAdmin}
                />
              </div>
              <div className="min-w-0">
                <QueryState isLoading={members.isLoading} error={members.error}>
                  {members.data ? (
                    <OrganizationMembersTable members={members.data} />
                  ) : null}
                </QueryState>
              </div>
            </div>
          ) : me.data ? (
            <OrganizationEmptyState />
          ) : null}
        </QueryState>
      </div>
    </AppShell>
  );
}

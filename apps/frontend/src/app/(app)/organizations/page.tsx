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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data?.organization ? (
            <>
              {canInviteMembers ? <CreateMemberInviteCard /> : null}
              <OrganizationDetails
                organization={me.data.organization}
                showEdit={canEditAsAdmin}
              />
              <QueryState isLoading={members.isLoading} error={members.error}>
                {members.data ? (
                  <OrganizationMembersTable members={members.data} />
                ) : null}
              </QueryState>
            </>
          ) : me.data ? (
            <OrganizationEmptyState />
          ) : null}
        </QueryState>
      </div>
    </AppShell>
  );
}

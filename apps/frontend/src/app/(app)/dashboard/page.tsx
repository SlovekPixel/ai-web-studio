"use client";

import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { OrganizationDetails } from "@/features/organizations/components/organization-details";
import { OrganizationEmptyState } from "@/features/organizations/components/organization-empty-state";
import { ProfileDetails } from "@/features/users/components/profile-details";
import { QueryState } from "@/components/shared/query-state";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useMe } from "@/features/users/hooks/use-me";

export default function DashboardPage() {
  const me = useMe();
  const logout = useLogout();

  return (
    <AppShell
      title="Главная"
      description="Обзор профиля и организации"
      actions={
        <Button
          type="button"
          variant="outline"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
          className="hidden sm:inline-flex"
        >
          {logout.isPending ? "Выход..." : "Выйти"}
        </Button>
      }
    >
      <QueryState isLoading={me.isLoading} error={me.error} loadingRows={2}>
        {me.data ? (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            {me.data.organization ? (
              <OrganizationDetails
                organization={me.data.organization}
                compact
              />
            ) : (
              <OrganizationEmptyState />
            )}

            <ProfileDetails user={me.data} compact />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="/organizations" />} variant="outline">
                Открыть организацию
              </Button>
              <Button render={<Link href="/profile" />} variant="outline">
                Открыть профиль
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={logout.isPending}
                onClick={() => logout.mutate()}
                className="sm:ml-auto"
              >
                {logout.isPending
                  ? "Выходим..."
                  : "Выйти"}
              </Button>
            </div>
          </div>
        ) : null}
      </QueryState>
    </AppShell>
  );
}

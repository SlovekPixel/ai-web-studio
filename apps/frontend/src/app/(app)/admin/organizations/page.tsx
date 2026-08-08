"use client";

import Link from "next/link";

import { AdminGuard } from "@/features/admin/components/admin-guard";
import { OrganizationsTable } from "@/features/admin/components/organizations-table";
import { AppShell } from "@/components/layout/app-shell";
import { QueryState } from "@/components/shared/query-state";
import { Button } from "@/components/ui/button";
import { useOrganizations } from "@/features/organizations/hooks/use-organizations";

export default function AdminOrganizationsPage() {
  const organizations = useOrganizations();

  return (
    <AppShell
      title="Управление организациями"
      description="Список всех организаций системы"
      actions={
        <Button render={<Link href="/admin/organizations/new" />}>
          Создать организацию
        </Button>
      }
    >
      <AdminGuard>
        <div className="mx-auto w-full max-w-6xl">
          <QueryState
            isLoading={organizations.isLoading}
            error={organizations.error}
          >
            {organizations.data ? (
              <OrganizationsTable organizations={organizations.data} />
            ) : null}
          </QueryState>
        </div>
      </AdminGuard>
    </AppShell>
  );
}

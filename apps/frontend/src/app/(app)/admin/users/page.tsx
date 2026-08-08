"use client";

import { AdminGuard } from "@/features/admin/components/admin-guard";
import { UsersTable } from "@/features/admin/components/users-table";
import { AppShell } from "@/components/layout/app-shell";
import { QueryState } from "@/components/shared/query-state";
import { useUsers } from "@/features/users/hooks/use-users";

export default function AdminUsersPage() {
  const users = useUsers();

  return (
    <AppShell
      title="Управление пользователями"
      description="Список всех пользователей системы"
    >
      <AdminGuard>
        <div className="mx-auto w-full max-w-6xl">
          <QueryState isLoading={users.isLoading} error={users.error}>
            {users.data ? <UsersTable users={users.data} /> : null}
          </QueryState>
        </div>
      </AdminGuard>
    </AppShell>
  );
}

"use client";

import { AdminGuard } from "@/features/admin/components/admin-guard";
import { CreateOrganizationInviteForm } from "@/features/admin/components/create-organization-invite-form";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminNewOrganizationPage() {
  return (
    <AppShell
      title="Создание организации"
      description="Сгенерируйте временную ссылку для регистрации владельца"
    >
      <AdminGuard>
        <div className="mx-auto w-full max-w-2xl">
          <CreateOrganizationInviteForm />
        </div>
      </AdminGuard>
    </AppShell>
  );
}

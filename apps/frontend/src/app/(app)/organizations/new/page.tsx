"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { QueryState } from "@/components/shared/query-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMe } from "@/features/users/hooks/use-me";

export default function NewOrganizationPage() {
  const me = useMe();
  const router = useRouter();

  useEffect(() => {
    if (me.data?.isAdmin) {
      router.replace("/admin/organizations/new");
    }
  }, [me.data, router]);

  return (
    <AppShell
      title="Создание организации"
      description="Создание организаций доступно в разделе администрирования"
    >
      <div className="mx-auto w-full max-w-2xl">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data?.isAdmin ? null : (
            <Alert>
              <AlertTitle>Недостаточно прав</AlertTitle>
              <AlertDescription>
                Создание организаций доступно только администраторам через
                временную ссылку-приглашение в разделе «Управление
                организациями».
              </AlertDescription>
            </Alert>
          )}
        </QueryState>
      </div>
    </AppShell>
  );
}

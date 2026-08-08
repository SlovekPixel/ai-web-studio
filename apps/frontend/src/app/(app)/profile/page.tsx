"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ProfileDetails } from "@/features/users/components/profile-details";
import { QueryState } from "@/components/shared/query-state";
import { useMe } from "@/features/users/hooks/use-me";

export default function ProfilePage() {
  const me = useMe();

  return (
    <AppShell
      title="Мой профиль"
      description="Полная информация о текущем пользователе"
    >
      <div className="mx-auto w-full max-w-4xl">
        <QueryState isLoading={me.isLoading} error={me.error}>
          {me.data ? <ProfileDetails user={me.data} /> : null}
        </QueryState>
      </div>
    </AppShell>
  );
}

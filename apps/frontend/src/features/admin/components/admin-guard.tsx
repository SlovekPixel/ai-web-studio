"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { QueryState } from "@/components/shared/query-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMe } from "@/features/users/hooks/use-me";

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const me = useMe();
  const router = useRouter();
  const isAdmin = Boolean(me.data?.isAdmin);

  useEffect(() => {
    if (me.isLoading || me.error || !me.data) {
      return;
    }

    if (!me.data.isAdmin) {
      router.replace("/dashboard");
    }
  }, [me.data, me.error, me.isLoading, router]);

  return (
    <QueryState isLoading={me.isLoading} error={me.error} loadingRows={2}>
      {me.data && !isAdmin ? (
        <Alert>
          <AlertTitle>Недостаточно прав</AlertTitle>
          <AlertDescription>
            Этот раздел доступен только администраторам.
          </AlertDescription>
        </Alert>
      ) : isAdmin ? (
        children
      ) : null}
    </QueryState>
  );
}

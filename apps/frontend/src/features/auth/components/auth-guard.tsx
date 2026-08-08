"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { QueryState } from "@/components/shared/query-state";
import { useMe } from "@/features/users/hooks/use-me";
import { ApiError } from "@/lib/api/errors";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const me = useMe();

  useEffect(() => {
    if (!me.isError) {
      return;
    }

    if (me.error instanceof ApiError && me.error.statusCode === 401) {
      router.replace("/login");
    }
  }, [me.error, me.isError, router]);

  if (me.isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <QueryState isLoading error={null}>
          {null}
        </QueryState>
      </div>
    );
  }

  if (me.isError) {
    if (me.error instanceof ApiError && me.error.statusCode === 401) {
      return null;
    }

    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <QueryState isLoading={false} error={me.error}>
          {null}
        </QueryState>
      </div>
    );
  }

  return <>{children}</>;
}

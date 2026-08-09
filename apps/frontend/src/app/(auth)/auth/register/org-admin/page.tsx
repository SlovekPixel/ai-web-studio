"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RegisterOrgAdminForm } from "@/features/auth/components/register-org-admin-form";
import { organizationsApi } from "@/features/organizations/api";
import { getErrorMessage } from "@/lib/api/errors";

function RegisterOrgAdminContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const invite = useQuery({
    queryKey: ["organization-invite", token],
    queryFn: () => organizationsApi.getInvite(token),
    enabled: Boolean(token),
    retry: false,
  });

  if (!token) {
    return (
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertTitle>Ссылка недействительна</AlertTitle>
        <AlertDescription>
          В адресе отсутствует токен приглашения.
        </AlertDescription>
      </Alert>
    );
  }

  if (invite.isLoading) {
    return <Skeleton className="h-96 w-full max-w-md" />;
  }

  if (invite.error || !invite.data) {
    return (
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertTitle>Ссылка недействительна</AlertTitle>
        <AlertDescription>
          {getErrorMessage(
            invite.error,
            "Приглашение истекло или уже было использовано.",
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <RegisterOrgAdminForm
      token={token}
      organizationName={invite.data.organizationName}
    />
  );
}

export default function RegisterOrgAdminPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-md" />}>
      <RegisterOrgAdminContent />
    </Suspense>
  );
}

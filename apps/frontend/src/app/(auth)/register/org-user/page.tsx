"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RegisterOrgUserForm } from "@/features/auth/components/register-org-user-form";
import { organizationsApi } from "@/features/organizations/api";
import { getErrorMessage } from "@/lib/api/errors";

function RegisterOrgUserContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const invite = useQuery({
    queryKey: ["organization-member-invite", token],
    queryFn: () => organizationsApi.getMemberInvite(token),
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
    <RegisterOrgUserForm
      token={token}
      organizationName={invite.data.organizationName}
    />
  );
}

export default function RegisterOrgUserPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-md" />}>
      <RegisterOrgUserContent />
    </Suspense>
  );
}

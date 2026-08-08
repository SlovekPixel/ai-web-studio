"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOrganizationRequestType } from "@repo/types";
import { toast } from "sonner";

import { organizationsApi } from "@/features/organizations/api";
import { organizationsQueryKey } from "@/features/organizations/hooks/use-organizations";
import { getErrorMessage } from "@/lib/api/errors";

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      body,
    }: {
      uuid: string;
      body: UpdateOrganizationRequestType;
    }) => organizationsApi.update(uuid, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
      toast.success("Организация обновлена");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Не удалось обновить организацию"));
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateMeRequestType } from "@repo/types";
import { toast } from "sonner";

import { authApi } from "@/features/auth/api";
import { usersApi } from "@/features/users/api";
import { meQueryKey } from "@/features/users/hooks/use-me";
import { getErrorMessage } from "@/lib/api/errors";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMeRequestType) => usersApi.updateMe(body),
    onSuccess: async (user) => {
      await authApi.refresh();
      queryClient.setQueryData(meQueryKey, user);
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      toast.success("Профиль обновлён");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Не удалось обновить профиль"));
    },
  });
}

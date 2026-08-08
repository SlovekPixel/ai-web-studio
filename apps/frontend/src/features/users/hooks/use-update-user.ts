"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserRequestType } from "@repo/types";
import { toast } from "sonner";

import { usersApi } from "@/features/users/api";
import { usersQueryKey } from "@/features/users/hooks/use-users";
import { getErrorMessage } from "@/lib/api/errors";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: UpdateUserRequestType;
    }) => usersApi.update(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersQueryKey });
      toast.success("Пользователь обновлён");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Не удалось обновить пользователя"));
    },
  });
}

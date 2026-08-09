"use client";

import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordRequestType } from "@repo/types";
import { toast } from "sonner";

import { authApi } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: ChangePasswordRequestType) =>
      authApi.changePassword(body),
    onSuccess: () => {
      toast.success("Пароль успешно изменён");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Не удалось сменить пароль"));
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "@/features/auth/api";
import { getErrorMessage } from "@/lib/api/errors";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: async () => {
      queryClient.clear();
      toast.success("Вы вышли из всех сессий");
      router.replace("/login");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Не удалось выйти из аккаунта"));
    },
  });
}

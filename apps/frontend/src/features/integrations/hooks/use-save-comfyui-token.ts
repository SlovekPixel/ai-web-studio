"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveComfyUiIntegrationTokenRequestType } from "@repo/types";
import { toast } from "sonner";

import { integrationsApi } from "@/features/integrations/api";
import { comfyUiIntegrationStatusQueryKey } from "@/features/integrations/hooks/use-comfyui-integration-status";
import { getErrorMessage } from "@/lib/api/errors";

export function useSaveComfyUiToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveComfyUiIntegrationTokenRequestType) =>
      integrationsApi.saveComfyUiToken(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: comfyUiIntegrationStatusQueryKey,
      });
      toast.success("Токен ComfyUI сохранён");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Не удалось сохранить токен"));
    },
  });
}

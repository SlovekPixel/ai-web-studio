"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { integrationsApi } from "@/features/integrations/api";
import { comfyUiIntegrationStatusQueryKey } from "@/features/integrations/hooks/use-comfyui-integration-status";
import { getErrorMessage } from "@/lib/api/errors";

export function useDeleteComfyUiIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => integrationsApi.deleteComfyUiIntegration(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: comfyUiIntegrationStatusQueryKey,
      });
      toast.success("Интеграция ComfyUI удалена");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Не удалось удалить интеграцию"));
    },
  });
}

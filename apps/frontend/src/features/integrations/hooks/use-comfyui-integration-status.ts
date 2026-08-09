"use client";

import { useQuery } from "@tanstack/react-query";

import { integrationsApi } from "@/features/integrations/api";

export const comfyUiIntegrationStatusQueryKey = [
  "integrations",
  "comfyui",
  "status",
] as const;

export function useComfyUiIntegrationStatus(enabled = true) {
  return useQuery({
    queryKey: comfyUiIntegrationStatusQueryKey,
    queryFn: () => integrationsApi.getComfyUiStatus(),
    enabled,
  });
}

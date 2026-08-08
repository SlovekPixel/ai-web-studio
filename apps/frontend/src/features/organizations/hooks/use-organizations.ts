"use client";

import { useQuery } from "@tanstack/react-query";

import { organizationsApi } from "@/features/organizations/api";

export const organizationsQueryKey = ["organizations", "list"] as const;

export function useOrganizations(enabled = true) {
  return useQuery({
    queryKey: organizationsQueryKey,
    queryFn: () => organizationsApi.list(),
    enabled,
  });
}

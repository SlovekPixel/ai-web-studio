"use client";

import { useQuery } from "@tanstack/react-query";

import { organizationsApi } from "@/features/organizations/api";

export const organizationMembersQueryKey = [
  "organizations",
  "members",
] as const;

export function useOrganizationMembers(enabled = true) {
  return useQuery({
    queryKey: organizationMembersQueryKey,
    queryFn: () => organizationsApi.listMembers(),
    enabled,
  });
}

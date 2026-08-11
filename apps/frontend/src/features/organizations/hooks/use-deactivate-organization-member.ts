"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { organizationsApi } from "@/features/organizations/api";
import { organizationMembersQueryKey } from "@/features/organizations/hooks/use-organization-members";
import { meQueryKey } from "@/features/users/hooks/use-me";

export function useDeactivateOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => organizationsApi.deactivateMember(userId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: organizationMembersQueryKey }),
        queryClient.invalidateQueries({ queryKey: meQueryKey }),
      ]);
    },
  });
}

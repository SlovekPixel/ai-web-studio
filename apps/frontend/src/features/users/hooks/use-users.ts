"use client";

import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/features/users/api";

export const usersQueryKey = ["users", "list"] as const;

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: () => usersApi.list(),
    enabled,
  });
}

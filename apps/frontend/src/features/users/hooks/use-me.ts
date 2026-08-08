"use client";

import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/features/users/api";

export const meQueryKey = ["users", "me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: () => usersApi.me(),
  });
}

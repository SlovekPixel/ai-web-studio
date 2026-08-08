import { PublicUserSchema, type PublicUserType } from "@repo/types";

import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";

export const usersApi = {
  me(): Promise<PublicUserType> {
    return api.get(apiRoutes.users.me, {
      responseSchema: PublicUserSchema,
    });
  },
};

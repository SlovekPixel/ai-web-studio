import {
  PublicUserSchema,
  UpdateMeRequestSchema,
  UpdateUserRequestSchema,
  type PublicUserType,
  type UpdateMeRequestType,
  type UpdateUserRequestType,
} from "@repo/types";
import { z } from "zod";

import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";

const PublicUserListSchema = z.array(PublicUserSchema);

export const usersApi = {
  me(): Promise<PublicUserType> {
    return api.get(apiRoutes.users.me, {
      responseSchema: PublicUserSchema,
    });
  },

  updateMe(body: UpdateMeRequestType): Promise<PublicUserType> {
    return api.patch(apiRoutes.users.me, {
      body,
      bodySchema: UpdateMeRequestSchema,
      responseSchema: PublicUserSchema,
    });
  },

  list(): Promise<PublicUserType[]> {
    return api.get(apiRoutes.users.root, {
      responseSchema: PublicUserListSchema,
    });
  },

  getById(id: string): Promise<PublicUserType> {
    return api.get(apiRoutes.users.byId(id), {
      responseSchema: PublicUserSchema,
    });
  },

  update(id: string, body: UpdateUserRequestType): Promise<PublicUserType> {
    return api.patch(apiRoutes.users.byId(id), {
      body,
      bodySchema: UpdateUserRequestSchema,
      responseSchema: PublicUserSchema,
    });
  },
};

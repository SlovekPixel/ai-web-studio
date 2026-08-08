import {
  LoginRequestSchema,
  RegisterRequestSchema,
  type LoginRequestType,
  type RegisterRequestType,
} from "@repo/types";

import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";

export const authApi = {
  login(body: LoginRequestType) {
    return api.post(apiRoutes.auth.login, {
      body,
      bodySchema: LoginRequestSchema,
      skipRefresh: true,
    });
  },

  register(body: RegisterRequestType) {
    return api.post(apiRoutes.auth.register, {
      body,
      bodySchema: RegisterRequestSchema,
      skipRefresh: true,
    });
  },

  refresh() {
    return api.post(apiRoutes.auth.refresh, { skipRefresh: true });
  },

  logoutAll() {
    return api.post(apiRoutes.auth.logoutAll, { skipRefresh: true });
  },
};

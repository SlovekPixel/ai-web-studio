import {
  ChangePasswordRequestSchema,
  LoginRequestSchema,
  RegisterOrgAdminRequestSchema,
  RegisterOrgUserRequestSchema,
  type ChangePasswordRequestType,
  type LoginRequestType,
  type RegisterOrgAdminRequestType,
  type RegisterOrgUserRequestType,
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

  registerOrgAdmin(body: RegisterOrgAdminRequestType) {
    return api.post(apiRoutes.auth.registerOrgAdmin, {
      body,
      bodySchema: RegisterOrgAdminRequestSchema,
      skipRefresh: true,
    });
  },

  registerOrgUser(body: RegisterOrgUserRequestType) {
    return api.post(apiRoutes.auth.registerOrgUser, {
      body,
      bodySchema: RegisterOrgUserRequestSchema,
      skipRefresh: true,
    });
  },

  changePassword(body: ChangePasswordRequestType) {
    return api.post(apiRoutes.auth.changePassword, {
      body,
      bodySchema: ChangePasswordRequestSchema,
    });
  },

  refresh() {
    return api.post(apiRoutes.auth.refresh, { skipRefresh: true });
  },

  logoutAll() {
    return api.post(apiRoutes.auth.logoutAll, { skipRefresh: true });
  },
};

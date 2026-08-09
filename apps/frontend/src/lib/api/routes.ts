export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    registerOrgAdmin: "/api/auth/register/org-admin",
    registerOrgUser: "/api/auth/register/org-user",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    logoutAll: "/api/auth/logout-all",
    changePassword: "/api/auth/change-password",
  },
  users: {
    me: "/api/users/me",
    root: "/api/users",
    byId: (id: string) => `/api/users/${id}`,
  },
  organizations: {
    root: "/api/organizations",
    byUuid: (uuid: string) => `/api/organizations/${uuid}`,
    members: "/api/organizations/me/members",
    invites: "/api/organizations/invites",
    inviteByToken: (token: string) =>
      `/api/organizations/invites/${encodeURIComponent(token)}`,
    memberInvites: "/api/organizations/member-invites",
    memberInviteByToken: (token: string) =>
      `/api/organizations/member-invites/${encodeURIComponent(token)}`,
  },
  integrations: {
    comfyui: "/api/integrations/comfyui-integration",
  },
} as const;

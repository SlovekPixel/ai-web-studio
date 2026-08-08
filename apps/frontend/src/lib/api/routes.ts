export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    logoutAll: "/api/auth/logout-all",
  },
  users: {
    me: "/api/users/me",
  },
  organizations: {
    root: "/api/organizations",
    byUuid: (uuid: string) => `/api/organizations/${uuid}`,
  },
} as const;

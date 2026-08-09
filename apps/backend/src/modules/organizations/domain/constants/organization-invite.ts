export const ORGANIZATION_INVITE_TTL_SECONDS = 120;

export const organizationInviteRedisKey = (token: string): string =>
  `org-invite:${token}`;

export const buildOrganizationInvitePath = (token: string): string =>
  `/auth/register/org-admin?token=${encodeURIComponent(token)}`;

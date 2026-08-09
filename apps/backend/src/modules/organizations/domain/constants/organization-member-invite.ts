export const ORGANIZATION_MEMBER_INVITE_TTL_SECONDS = 120;

export const organizationMemberInviteTokenKey = (token: string): string =>
  `org-member-invite:token:${token}`;

export const organizationMemberInviteOrgKey = (
  organizationUuid: string,
): string => `org-member-invite:org:${organizationUuid}`;

export const buildOrganizationMemberInvitePath = (token: string): string =>
  `/register/org-user?token=${encodeURIComponent(token)}`;

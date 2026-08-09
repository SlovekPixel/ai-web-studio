export type OrganizationMemberInvitePayload = {
  organizationUuid: string;
  organizationName: string;
  expiresAt: string;
};

export interface IOrganizationMemberInviteStore {
  replace(
    organizationUuid: string,
    token: string,
    payload: OrganizationMemberInvitePayload,
    ttlSeconds: number,
  ): Promise<void>;
  get(token: string): Promise<OrganizationMemberInvitePayload | null>;
  consume(token: string): Promise<OrganizationMemberInvitePayload | null>;
}

export const ORGANIZATION_MEMBER_INVITE_STORE = Symbol(
  'ORGANIZATION_MEMBER_INVITE_STORE',
);

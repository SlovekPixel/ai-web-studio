export type OrganizationInvitePayload = {
  name: string;
  expiresAt: string;
};

export interface IOrganizationInviteStore {
  save(
    token: string,
    payload: OrganizationInvitePayload,
    ttlSeconds: number,
  ): Promise<void>;
  get(token: string): Promise<OrganizationInvitePayload | null>;
  consume(token: string): Promise<OrganizationInvitePayload | null>;
}

export const ORGANIZATION_INVITE_STORE = Symbol('ORGANIZATION_INVITE_STORE');

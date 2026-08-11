import {
  CreateOrganizationInviteRequestSchema,
  OrganizationInvitePreviewSchema,
  OrganizationInviteResponseSchema,
  OrganizationMemberInvitePreviewSchema,
  OrganizationMemberInviteResponseSchema,
  PublicOrganizationSchema,
  PublicUserSchema,
  UpdateOrganizationRequestSchema,
  type CreateOrganizationInviteRequestType,
  type OrganizationInvitePreviewType,
  type OrganizationInviteResponseType,
  type OrganizationMemberInvitePreviewType,
  type OrganizationMemberInviteResponseType,
  type PublicOrganizationType,
  type PublicUserType,
  type UpdateOrganizationRequestType,
} from "@repo/types";
import { z } from "zod";

import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";

const PublicOrganizationListSchema = z.array(PublicOrganizationSchema);
const PublicUserListSchema = z.array(PublicUserSchema);

export const organizationsApi = {
  list(): Promise<PublicOrganizationType[]> {
    return api.get(apiRoutes.organizations.root, {
      responseSchema: PublicOrganizationListSchema,
    });
  },

  getByUuid(uuid: string): Promise<PublicOrganizationType> {
    return api.get(apiRoutes.organizations.byUuid(uuid), {
      responseSchema: PublicOrganizationSchema,
    });
  },

  listMembers(): Promise<PublicUserType[]> {
    return api.get(apiRoutes.organizations.members, {
      responseSchema: PublicUserListSchema,
    });
  },

  deactivateMember(userId: string): Promise<PublicUserType> {
    return api.post(apiRoutes.organizations.deactivateMember(userId), {
      responseSchema: PublicUserSchema,
    });
  },

  createInvite(
    body: CreateOrganizationInviteRequestType,
  ): Promise<OrganizationInviteResponseType> {
    return api.post(apiRoutes.organizations.invites, {
      body,
      bodySchema: CreateOrganizationInviteRequestSchema,
      responseSchema: OrganizationInviteResponseSchema,
    });
  },

  getInvite(token: string): Promise<OrganizationInvitePreviewType> {
    return api.get(apiRoutes.organizations.inviteByToken(token), {
      responseSchema: OrganizationInvitePreviewSchema,
      skipRefresh: true,
    });
  },

  createMemberInvite(): Promise<OrganizationMemberInviteResponseType> {
    return api.post(apiRoutes.organizations.memberInvites, {
      responseSchema: OrganizationMemberInviteResponseSchema,
    });
  },

  getMemberInvite(token: string): Promise<OrganizationMemberInvitePreviewType> {
    return api.get(apiRoutes.organizations.memberInviteByToken(token), {
      responseSchema: OrganizationMemberInvitePreviewSchema,
      skipRefresh: true,
    });
  },

  update(
    uuid: string,
    body: UpdateOrganizationRequestType,
  ): Promise<PublicOrganizationType> {
    return api.patch(apiRoutes.organizations.byUuid(uuid), {
      body,
      bodySchema: UpdateOrganizationRequestSchema,
      responseSchema: PublicOrganizationSchema,
    });
  },
};

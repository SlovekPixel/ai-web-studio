import { z } from 'zod';

export * from './schemas';

import {
  CreateOrganizationInviteRequestSchema,
  OrganizationInvitePreviewSchema,
  OrganizationInviteResponseSchema,
  OrganizationMemberInvitePreviewSchema,
  OrganizationMemberInviteResponseSchema,
  PublicOrganizationSchema,
  UpdateOrganizationRequestSchema,
} from './schemas';

export type PublicOrganizationType = z.infer<typeof PublicOrganizationSchema>;
export type CreateOrganizationInviteRequestType = z.infer<
  typeof CreateOrganizationInviteRequestSchema
>;
export type OrganizationInviteResponseType = z.infer<
  typeof OrganizationInviteResponseSchema
>;
export type OrganizationInvitePreviewType = z.infer<
  typeof OrganizationInvitePreviewSchema
>;
export type OrganizationMemberInviteResponseType = z.infer<
  typeof OrganizationMemberInviteResponseSchema
>;
export type OrganizationMemberInvitePreviewType = z.infer<
  typeof OrganizationMemberInvitePreviewSchema
>;
export type UpdateOrganizationRequestType = z.infer<
  typeof UpdateOrganizationRequestSchema
>;

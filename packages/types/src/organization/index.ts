import { z } from 'zod';

export * from './schemas';

import {
  AddOrganizationUserRequestSchema,
  CreateOrganizationRequestSchema,
  PublicOrganizationSchema,
  UpdateOrganizationRequestSchema,
} from './schemas';

export type PublicOrganizationType = z.infer<typeof PublicOrganizationSchema>;
export type CreateOrganizationRequestType = z.infer<
  typeof CreateOrganizationRequestSchema
>;
export type UpdateOrganizationRequestType = z.infer<
  typeof UpdateOrganizationRequestSchema
>;
export type AddOrganizationUserRequestType = z.infer<
  typeof AddOrganizationUserRequestSchema
>;

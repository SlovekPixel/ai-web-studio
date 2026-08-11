import { z } from 'zod';

const uuidExample = '123e4567-e89b-12d3-a456-426614174000';

export const organizationNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .meta({ title: 'Name', example: 'Acme Corp' });

export const organizationDescriptionSchema = z
  .string()
  .trim()
  .max(5000)
  .nullable()
  .meta({ title: 'Description', example: 'Software company' });

export const organizationInnSchema = z
  .string()
  .trim()
  .regex(/^\d{10}(\d{2})?$/, 'INN must be 10 or 12 digits')
  .nullable()
  .meta({ title: 'INN', example: '7707083893' });

export const organizationOwnerIdSchema = z.uuid().meta({
  title: 'Owner ID',
  example: uuidExample,
});

export const PublicOrganizationSchema = z.object({
  uuid: z.uuid().meta({
    title: 'UUID',
    example: uuidExample,
  }),
  name: organizationNameSchema,
  description: organizationDescriptionSchema,
  inn: z.string().nullable().meta({ title: 'INN', example: '7707083893' }),
  ownerId: organizationOwnerIdSchema,
  active: z.boolean().meta({ title: 'Active', example: true }),
  maxMembers: z.number().int().positive().meta({
    title: 'Max Members',
    example: 10,
  }),
  currentMembersAll: z.number().int().nonnegative().meta({
    title: 'Current Members (all)',
    example: 3,
  }),
  currentMembersActive: z.number().int().nonnegative().meta({
    title: 'Current Members (active)',
    example: 2,
  }),
  createdAt: z.iso
    .datetime()
    .meta({ title: 'Created At', example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.iso
    .datetime()
    .meta({ title: 'Updated At', example: '2026-01-01T00:00:00.000Z' }),
});

export const CreateOrganizationInviteRequestSchema = z.object({
  name: organizationNameSchema,
});

export const OrganizationInviteResponseSchema = z.object({
  token: z.string().min(1).meta({
    title: 'Invite token',
    example: 'dGhpcy1pcy1hLXNhbXBsZS10b2tlbg',
  }),
  expiresAt: z.iso.datetime().meta({
    title: 'Expires At',
    example: '2026-01-01T00:02:00.000Z',
  }),
  invitePath: z.string().min(1).meta({
    title: 'Invite path',
    example: '/auth/register/org-admin?token=dGhpcy1pcy1hLXNhbXBsZS10b2tlbg',
  }),
});

export const OrganizationInvitePreviewSchema = z.object({
  organizationName: organizationNameSchema,
  expiresAt: z.iso.datetime().meta({
    title: 'Expires At',
    example: '2026-01-01T00:02:00.000Z',
  }),
});

export const UpdateOrganizationRequestSchema = PublicOrganizationSchema.pick({
  name: true,
  description: true,
  active: true,
}).partial();

export const OrganizationMemberInviteResponseSchema =
  OrganizationInviteResponseSchema.extend({
    invitePath: z.string().min(1).meta({
      title: 'Invite path',
      example: '/register/org-user?token=dGhpcy1pcy1hLXNhbXBsZS10b2tlbg',
    }),
  });

export const OrganizationMemberInvitePreviewSchema =
  OrganizationInvitePreviewSchema;

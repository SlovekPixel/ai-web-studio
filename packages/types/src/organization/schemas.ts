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
  createdAt: z.iso
    .datetime()
    .meta({ title: 'Created At', example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.iso
    .datetime()
    .meta({ title: 'Updated At', example: '2026-01-01T00:00:00.000Z' }),
});

export const CreateOrganizationRequestSchema = z.object({
  name: organizationNameSchema,
  description: organizationDescriptionSchema.optional(),
  inn: organizationInnSchema.optional(),
  ownerId: organizationOwnerIdSchema,
});

export const UpdateOrganizationRequestSchema = PublicOrganizationSchema.pick({
  name: true,
  description: true,
  active: true,
}).partial();

export const AddOrganizationUserRequestSchema = z.object({
  userId: z.uuid().meta({
    title: 'User ID',
    example: uuidExample,
  }),
});

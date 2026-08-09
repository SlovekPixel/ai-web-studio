import { z } from 'zod';

import { PublicOrganizationSchema } from "../organization";

const uuidExample = '123e4567-e89b-12d3-a456-426614174000';

export const userLoginSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .meta({ title: 'Login', example: 'Frank' });

export const userFullNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .meta({ title: 'Full Name', example: 'Frank Ocean' });

export const PublicUserSchema = z.object({
  id: z.uuid().meta({
    title: 'ID',
    example: uuidExample,
  }),
  login: z.string().meta({ title: 'Login', example: 'Frank' }),
  email: z
    .email()
    .nullable()
    .meta({ title: 'Email', example: 'frank@example.com' }),
  fullName: z.string().meta({ title: 'Full Name', example: 'Frank Ocean' }),
  active: z.boolean().meta({ title: 'Active', example: true }),
  orgId: z.uuid().nullable().meta({
    title: 'Organization ID',
    example: uuidExample,
  }),
  isAdmin: z.boolean().meta({ title: 'Is Admin', example: true }),
  isOrgOwner: z.boolean().meta({ title: 'Is Org Owner', example: false }),
  organization: PublicOrganizationSchema.nullable().meta({
    title: 'Organization',
  }),
  loginAt: z.iso
    .datetime()
    .nullable()
    .meta({ title: 'Login At', example: '2026-01-01T00:00:00.000Z' }),
  createdAt: z.iso
    .datetime()
    .meta({ title: 'Created At', example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: z.iso
    .datetime()
    .meta({ title: 'Updated At', example: '2026-01-01T00:00:00.000Z' }),
});

export const UpdateUserRequestSchema = z.object({
  active: z.boolean().meta({ title: 'Active', example: true }),
});

export const UpdateMeRequestSchema = z
  .object({
    fullName: userFullNameSchema.optional(),
    email: z
      .email()
      .meta({ title: 'Email', example: 'frank@example.com' })
      .optional(),
  })
  .refine(
    (value) => value.fullName !== undefined || value.email !== undefined,
    {
      message: 'At least one of fullName or email must be provided',
    },
  );

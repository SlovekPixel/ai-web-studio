import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ExceptionResponseSchema = z.object({
  statusCode: z.number().int().meta({
    title: 'Status Code',
    example: 500,
  }),
  path: z.string().meta({
    title: 'Path',
    example: '/api/organizations',
  }),
  message: z.string().meta({
    title: 'Message',
    example: 'API server error',
  }),
  details: z.string().optional().meta({
    title: 'Details',
    example: 'Unexpected database failure',
  }),
  timestamp: z.iso.datetime().meta({
    title: 'Timestamp',
    example: '2026-01-01T00:00:00.000Z',
  }),
});

export type ExceptionResponse = z.infer<typeof ExceptionResponseSchema>;

export class ExceptionResponseDto extends createZodDto(
  ExceptionResponseSchema,
) {}

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const PaginationSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0).openapi({ description: 'Number of items to skip', example: 0 }),
  limit: z.coerce.number().int().min(1).max(100).default(20).openapi({ description: 'Number of items to return', example: 20 }),
  sortBy: z.enum(['createdAt', 'askingPrice', 'likeCount']).default('createdAt').openapi({ description: 'Field to sort by' }),
  sortOrder: z.enum(['asc', 'desc']).default('desc').openapi({ description: 'Sort direction' }),
});

export type PaginationQuery = z.infer<typeof PaginationSchema>;

import { z } from 'zod';
import { PaginationSchema } from './pagination.schema';

export const ListingQuerySchema = PaginationSchema.extend({
  search: z.string().optional().openapi({ description: 'Search in title and caption', example: 'dress' }),
  category: z.string().optional().openapi({ description: 'Filter by category id', example: 'wearables.clothes.dresses' }),
  size: z.string().optional().openapi({ description: 'Filter by size', example: 'S' }),
  sold: z.enum(['true', 'false']).optional().openapi({ description: 'Filter by sold status' }),
});

export const CreateListingSchema = z.object({
  title: z.string().min(1).max(20).openapi({ example: 'Audrey Dress' }),
  caption: z.string().max(500).optional().openapi({ example: 'Beautiful dress in size S' }),
  size: z.string().optional().openapi({ example: 'S' }),
  category: z.string().min(1).openapi({ example: 'wearables.clothes.dresses' }),
  askingPrice: z.number().positive().openapi({ example: 1200 }),
  currency: z.string().length(3).openapi({ example: 'NOK' }),
  primaryImage: z.string().url().openapi({ example: 'https://example.com/image.jpg' }),
  secondaryImage: z.string().url().optional().nullable().openapi({ example: null }),
});

export type ListingQuery = z.infer<typeof ListingQuerySchema>;
export type CreateListingInput = z.infer<typeof CreateListingSchema>;

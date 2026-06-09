import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { PaginationSchema } from './pagination.schema';

extendZodWithOpenApi(z);

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

export const OwnerSchema = z.object({
  id: z.string().openapi({ example: '6135f8331cafb900977e4c35' }),
  username: z.string().openapi({ example: 'piatjelta' }),
  name: z.string().openapi({ example: 'Pia Tjelta' }),
  picture: z.string().openapi({ example: 'https://tise-static.telenorcdn.net/profile-pictures/...' }),
}).openapi('Owner');

export const ListingResponseSchema = z.object({
  id: z.string().openapi({ example: '61a2523e9b4e8800979b842a' }),
  createdAt: z.string().openapi({ example: '2021-11-27T15:43:58.763Z' }),
  title: z.string().openapi({ example: 'Audrey Dress' }),
  caption: z.string().openapi({ example: 'A beautiful dress' }),
  size: z.string().openapi({ example: 'S' }),
  category: z.string().openapi({ example: 'wearables.clothes.dresses' }),
  askingPrice: z.number().openapi({ example: 2900 }),
  currency: z.string().openapi({ example: 'NOK' }),
  sold: z.boolean().openapi({ example: false }),
  likeCount: z.number().openapi({ example: 40 }),
  liked: z.boolean().openapi({ example: false }),
  owner: OwnerSchema,
  primaryImage: z.string().openapi({ example: 'https://tise-static.telenorcdn.net/image.jpg' }),
  secondaryImage: z.string().nullable().openapi({ example: null }),
}).openapi('Listing');

export const PaginatedListingsSchema = z.object({
  data: z.array(ListingResponseSchema),
  total: z.number().openapi({ example: 67 }),
  offset: z.number().openapi({ example: 0 }),
  limit: z.number().openapi({ example: 20 }),
}).openapi('PaginatedListings');

export const ListingSchema = ListingResponseSchema.omit({ likeCount: true, liked: true });

export type Owner = z.infer<typeof OwnerSchema>;
export type Listing = z.infer<typeof ListingSchema>;
export type ListingResponse = z.infer<typeof ListingResponseSchema>;
export type ListingQuery = z.infer<typeof ListingQuerySchema>;
export type CreateListingInput = z.infer<typeof CreateListingSchema>;

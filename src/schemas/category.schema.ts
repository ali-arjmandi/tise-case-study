import { z } from 'zod';

export const CategoryResponseSchema = z.object({
  id: z.string().openapi({ example: 'wearables.clothes.dresses' }),
  title: z.string().openapi({ example: 'Dresses' }),
  icon: z.string().openapi({ example: 'https://tise-static.telenorcdn.net/category-images/wearables.clothes.dresses/icon.png' }),
}).openapi('Category');

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'Resource not found' }),
  code: z.string().openapi({ example: 'NOT_FOUND' }),
}).openapi('Error');

export type CategoryDto = z.infer<typeof CategoryResponseSchema>;

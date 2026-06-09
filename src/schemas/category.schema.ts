import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CategoryResponseSchema = z.object({
  id: z.string().openapi({ example: 'wearables.clothes.dresses' }),
  title: z.string().openapi({ example: 'Dresses' }),
  icon: z.string().openapi({ example: 'https://tise-static.telenorcdn.net/category-images/wearables.clothes.dresses/icon.png' }),
}).openapi('Category');

export type Category = z.infer<typeof CategoryResponseSchema>;

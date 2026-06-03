import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().openapi({ example: 'wearables.clothes.dresses' }),
  title: z.string().openapi({ example: 'Dresses' }),
  icon: z.string().url().openapi({ example: 'https://tise-static.telenorcdn.net/category-images/wearables.clothes.dresses/wearables.clothes.dresses_unselected_1.png' }),
});

export type CategoryDto = z.infer<typeof CategorySchema>;

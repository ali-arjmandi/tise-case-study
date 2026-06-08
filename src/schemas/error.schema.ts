import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ErrorSchema = z.object({
  error: z.string().openapi({ example: 'Resource not found' }),
  code: z.string().openapi({ example: 'NOT_FOUND' }),
}).openapi('Error');
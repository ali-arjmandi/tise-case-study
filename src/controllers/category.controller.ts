import { Application } from 'express';
import { z } from 'zod';
import { registry } from '../openapi/registry';
import { CategoryService } from '../services/category.service';
import { CategoryResponseSchema } from '../schemas/category.schema';

export function registerCategoryRoutes(app: Application, service: CategoryService): void {
  registry.registerPath({
    method: 'get', path: '/categories', summary: 'List all categories', tags: ['Categories'],
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: z.array(CategoryResponseSchema) } } } },
  });
  app.get('/api/categories', (_req, res, next) => {
    try {
      res.json(service.getAll());
    } catch (err) { next(err); }
  });
}

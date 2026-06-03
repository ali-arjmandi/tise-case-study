import { Application } from 'express';
import { z } from 'zod';
import { registry } from '../openapi/registry';
import { ListingService } from '../services/listing.service';
import { validate, requireUserId } from '../middleware/validate';
import { ListingQuerySchema, CreateListingSchema, ListingResponseSchema, PaginatedListingsSchema } from '../schemas/listing.schema';
import { ErrorSchema } from '../schemas/category.schema';

export function registerListingRoutes(app: Application, service: ListingService): void {
  const idParam = z.object({ id: z.string() });

  registry.registerPath({
    method: 'get', path: '/listings', summary: 'List listings', tags: ['Listings'],
    security: [{ UserId: [] }],
    request: { query: ListingQuerySchema },
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: PaginatedListingsSchema } } } },
  });
  app.get('/api/listings', validate(ListingQuerySchema, 'query'), (req, res, next) => {
    try {
      res.json(service.getAll(req.query as any, req.header('x-user-id')));
    } catch (err) { next(err); }
  });

  registry.registerPath({
    method: 'get', path: '/listings/{id}', summary: 'Get a listing by id', tags: ['Listings'],
    security: [{ UserId: [] }],
    request: { params: idParam },
    responses: {
      200: { description: 'OK', content: { 'application/json': { schema: ListingResponseSchema } } },
      404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
    },
  });
  app.get('/api/listings/:id', (req, res, next) => {
    try {
      res.json(service.getById(req.params.id, req.header('x-user-id')));
    } catch (err) { next(err); }
  });

  registry.registerPath({
    method: 'post', path: '/listings', summary: 'Create a listing', tags: ['Listings'],
    security: [{ UserId: [] }],
    request: { body: { content: { 'application/json': { schema: CreateListingSchema } } } },
    responses: {
      201: { description: 'Created', content: { 'application/json': { schema: ListingResponseSchema } } },
      400: { description: 'Validation error', content: { 'application/json': { schema: ErrorSchema } } },
      401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
    },
  });
  app.post('/api/listings', requireUserId, validate(CreateListingSchema, 'body'), (req, res, next) => {
    try {
      res.status(201).json(service.create(req.body, req.header('x-user-id')!));
    } catch (err) { next(err); }
  });

  registry.registerPath({
    method: 'post', path: '/listings/{id}/like', summary: 'Like a listing', tags: ['Listings'],
    security: [{ UserId: [] }],
    request: { params: idParam },
    responses: {
      204: { description: 'Liked' },
      401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
      404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
    },
  });
  app.post('/api/listings/:id/like', requireUserId, (req, res, next) => {
    try {
      service.like(req.params.id, req.header('x-user-id')!);
      res.status(204).send();
    } catch (err) { next(err); }
  });

  registry.registerPath({
    method: 'delete', path: '/listings/{id}/like', summary: 'Unlike a listing', tags: ['Listings'],
    security: [{ UserId: [] }],
    request: { params: idParam },
    responses: {
      204: { description: 'Unliked' },
      401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
      404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
    },
  });
  app.delete('/api/listings/:id/like', requireUserId, (req, res, next) => {
    try {
      service.unlike(req.params.id, req.header('x-user-id')!);
      res.status(204).send();
    } catch (err) { next(err); }
  });
}

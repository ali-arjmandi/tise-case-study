import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ListingResponseSchema, PaginatedListingsSchema, CreateListingSchema, ListingQuerySchema } from '../schemas/listing.schema';
import { CategoryResponseSchema } from '../schemas/category.schema';
import { PaginationSchema } from '../schemas/pagination.schema';
import { ErrorSchema } from '../schemas/error.schema';

export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'UserId', {
  type: 'apiKey',
  in: 'header',
  name: 'X-User-Id',
  description: 'User identifier. Required for write operations; optional for read operations to compute the `liked` field.',
});

registry.register('Pagination', PaginationSchema);
registry.register('Listing', ListingResponseSchema);
registry.register('PaginatedListings', PaginatedListingsSchema);
registry.register('CreateListing', CreateListingSchema);
registry.register('ListingQuery', ListingQuerySchema);
registry.register('Category', CategoryResponseSchema);
registry.register('Error', ErrorSchema);

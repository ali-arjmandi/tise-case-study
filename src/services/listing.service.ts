import { ListingRepository } from '../repositories/listing.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { Listing, ListingResponse, ListingQuery, CreateListingInput } from '../schemas/listing.schema';
import { PaginatedResponse } from '../schemas/pagination.schema';
import { NotFoundError, ValidationError } from '../errors/app.error';

export class ListingService {
  constructor(
    private readonly listings: ListingRepository,
    private readonly categories: CategoryRepository,
  ) {}

  getAll(query: ListingQuery, userId?: string): PaginatedResponse<ListingResponse> {
    const { offset, limit } = query;

    const results = this.listings.findFiltered(query);
    const total = results.length;
    const page = results.slice(offset, offset + limit);

    return {
      data: page.map((l) => this.listings.toResponse(l, userId)),
      total,
      offset,
      limit,
    };
  }

  getById(id: string, userId?: string): ListingResponse {
    const listing = this.listings.findById(id);
    if (!listing) throw new NotFoundError(`Listing ${id} not found`);
    return this.listings.toResponse(listing, userId);
  }

  create(input: CreateListingInput, userId: string): ListingResponse {
    const categoryExists = this.categories.findById(input.category);
    if (!categoryExists) throw new ValidationError(`Category '${input.category}' does not exist`);

    const listing: Listing = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: input.title,
      caption: input.caption ?? '',
      size: input.size ?? '',
      category: input.category,
      askingPrice: input.askingPrice,
      currency: input.currency,
      sold: false,
      owner: {
        id: userId,
        username: userId,
        name: userId,
        picture: '',
      },
      primaryImage: input.primaryImage,
      secondaryImage: input.secondaryImage ?? null,
    };

    this.listings.create(listing);
    return this.listings.toResponse(listing, userId);
  }

  like(listingId: string, userId: string): void {
    const listing = this.listings.findById(listingId);
    if (!listing) throw new NotFoundError(`Listing ${listingId} not found`);
    this.listings.like(listingId, userId);
  }

  unlike(listingId: string, userId: string): void {
    const listing = this.listings.findById(listingId);
    if (!listing) throw new NotFoundError(`Listing ${listingId} not found`);
    this.listings.unlike(listingId, userId);
  }
}

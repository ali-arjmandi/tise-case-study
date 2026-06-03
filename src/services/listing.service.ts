import { ListingRepository } from '../repositories/listing.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { ListingResponse, PaginatedResponse, Listing } from '../models/listing';
import { ListingQuery, CreateListingInput } from '../schemas/listing.schema';
import { NotFoundError, ValidationError } from '../errors/app.error';

export class ListingService {
  constructor(
    private readonly listings: ListingRepository,
    private readonly categories: CategoryRepository,
  ) {}

  getAll(query: ListingQuery, userId?: string): PaginatedResponse<ListingResponse> {
    const { offset, limit, sortBy, sortOrder, search, category, size, sold } = query;

    let results = this.listings.findAll();

    if (search) {
      const term = search.toLowerCase();
      results = results.filter(
        (l) => l.title.toLowerCase().includes(term) || l.caption.toLowerCase().includes(term),
      );
    }

    if (category) {
      results = results.filter((l) => l.category === category);
    }

    if (size) {
      results = results.filter((l) => l.size.toLowerCase() === size.toLowerCase());
    }

    if (sold !== undefined) {
      const soldBool = sold === 'true';
      results = results.filter((l) => l.sold === soldBool);
    }

    results.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortBy === 'likeCount') {
        aVal = this.listings.getLikeCount(a.id);
        bVal = this.listings.getLikeCount(b.id);
      } else {
        aVal = a[sortBy];
        bVal = b[sortBy];
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

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

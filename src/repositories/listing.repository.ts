import { listingsStore, likesStore } from '../db/store';
import { Listing, ListingResponse, ListingQuery } from '../schemas/listing.schema';

export interface IListingRepository {
  findAll(): Listing[];
  findFiltered(query: ListingQuery): Listing[];
  findById(id: string): Listing | undefined;
  create(listing: Listing): Listing;
  like(listingId: string, userId: string): void;
  unlike(listingId: string, userId: string): void;
  getLikeCount(listingId: string): number;
  hasLiked(listingId: string, userId: string): boolean;
}

export class ListingRepository implements IListingRepository {
  findAll(): Listing[] {
    return Array.from(listingsStore.values());
  }

  findFiltered({ search, category, size, sold, sortBy, sortOrder }: ListingQuery): Listing[] {
    let results = this.findAll();

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
        aVal = this.getLikeCount(a.id);
        bVal = this.getLikeCount(b.id);
      } else {
        aVal = a[sortBy];
        bVal = b[sortBy];
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return results;
  }

  findById(id: string): Listing | undefined {
    return listingsStore.get(id);
  }

  create(listing: Listing): Listing {
    listingsStore.set(listing.id, listing);
    likesStore.set(listing.id, new Set());
    return listing;
  }

  like(listingId: string, userId: string): void {
    const likes = likesStore.get(listingId) ?? new Set<string>();
    likes.add(userId);
    likesStore.set(listingId, likes);
  }

  unlike(listingId: string, userId: string): void {
    likesStore.get(listingId)?.delete(userId);
  }

  getLikeCount(listingId: string): number {
    return likesStore.get(listingId)?.size ?? 0;
  }

  hasLiked(listingId: string, userId: string): boolean {
    return likesStore.get(listingId)?.has(userId) ?? false;
  }

  toResponse(listing: Listing, userId?: string): ListingResponse {
    return {
      ...listing,
      likeCount: this.getLikeCount(listing.id),
      liked: userId ? this.hasLiked(listing.id, userId) : false,
    };
  }
}

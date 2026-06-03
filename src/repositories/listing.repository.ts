import { listingsStore, likesStore } from '../db/store';
import { Listing, ListingResponse } from '../models/listing';

export interface IListingRepository {
  findAll(): Listing[];
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

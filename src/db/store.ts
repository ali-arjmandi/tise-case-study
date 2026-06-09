import { Listing } from '../schemas/listing.schema';
import { Category } from '../schemas/category.schema';

export const listingsStore = new Map<string, Listing>();
export const likesStore = new Map<string, Set<string>>();
export const categoriesStore = new Map<string, Category>();

export function resetStore(): void {
  listingsStore.clear();
  likesStore.clear();
  categoriesStore.clear();
}

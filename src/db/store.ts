import { Listing } from '../models/listing';
import { Category } from '../models/category';

export const listingsStore = new Map<string, Listing>();
export const likesStore = new Map<string, Set<string>>();
export const categoriesStore = new Map<string, Category>();

export function resetStore(): void {
  listingsStore.clear();
  likesStore.clear();
  categoriesStore.clear();
}

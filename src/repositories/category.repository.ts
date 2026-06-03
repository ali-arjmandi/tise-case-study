import { categoriesStore } from '../db/store';
import { Category } from '../models/category';

export interface ICategoryRepository {
  findAll(): Category[];
  findById(id: string): Category | undefined;
}

export class CategoryRepository implements ICategoryRepository {
  findAll(): Category[] {
    return Array.from(categoriesStore.values());
  }

  findById(id: string): Category | undefined {
    return categoriesStore.get(id);
  }
}

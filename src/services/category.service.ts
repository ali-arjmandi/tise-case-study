import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../models/category';

export class CategoryService {
  constructor(private readonly categories: CategoryRepository) {}

  getAll(): Category[] {
    return this.categories.findAll();
  }
}

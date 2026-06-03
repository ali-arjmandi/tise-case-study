import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { ListingRepository } from './repositories/listing.repository';
import { CategoryRepository } from './repositories/category.repository';
import { ListingService } from './services/listing.service';
import { CategoryService } from './services/category.service';
import { registerListingRoutes } from './controllers/listing.controller';
import { registerCategoryRoutes } from './controllers/category.controller';
import { errorHandler } from './middleware/error';
import { mountSwagger } from './openapi/swagger';

const app = express();

app.use(cors());
app.use(express.json());

const listingRepo = new ListingRepository();
const categoryRepo = new CategoryRepository();
const listingService = new ListingService(listingRepo, categoryRepo);
const categoryService = new CategoryService(categoryRepo);

registerListingRoutes(app, listingService);
registerCategoryRoutes(app, categoryService);

mountSwagger(app);

app.use(errorHandler);

export default app;

// Components
export { ProductImage } from './components/ProductImage';

// Pages
export { CreateProductPage } from './pages/CreateProductPage';
export { UpdateProductPage } from './pages/UpdateProductPage';
export { UserProductsPage } from './pages/UserProductsPage';

// Services
export { ProductService } from './services/products.service';
export type { PaginatedResponse } from './services/products.service';

// Types
export type {
  Product,
  CreateProductData,
  UpdateProductData,
  ApiError,
  ApiResponse,
} from './types/products.types';

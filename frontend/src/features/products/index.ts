// Components
export { ProductImage } from './components/ProductImage';

// Pages
export { CreateProductPage } from './pages/CreateProductPage';
export { UpdateProductPage } from './pages/UpdateProductPage';
export { UserProductsPage } from './pages/UserProductsPage';

// Services
export { ProductService } from './services/product.service';
export type { PaginatedResponse } from './services/product.service';

// Types
export type {
  Product,
  CreateProductData,
  UpdateProductData,
  ApiError,
  ApiResponse,
} from './types/product.types';

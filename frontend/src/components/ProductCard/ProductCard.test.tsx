import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types/product';

// Mock the UI components
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

vi.mock('./ProductCardStub', () => ({
  ProductCardStub: () => <div data-testid="product-stub">Stub Image</div>,
}));

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Album',
    artist: 'Test Artist',
    coverImage: 'https://example.com/cover.jpg',
    userId: 'user-1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };

  it('should render product name and artist', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('should display skeleton while image is loading', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should display image with correct attributes when loaded', async () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Test Album cover') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe('https://example.com/cover.jpg');

    // Simulate image load
    image.onload?.(new Event('load'));

    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).toBeInTheDocument();
    });
  });

  it('should show stub when image fails to load', async () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Test Album cover') as HTMLImageElement;

    // Simulate image error using fireEvent
    const errorEvent = new Event('error', { bubbles: true });
    image.dispatchEvent(errorEvent);

    await waitFor(() => {
      expect(screen.getByTestId('product-stub')).toBeInTheDocument();
      expect(screen.queryByAltText('Test Album cover')).not.toBeInTheDocument();
    });
  });

  it('should show stub when product has no cover image', () => {
    const productWithoutCover: Product = {
      ...mockProduct,
      coverImage: null,
    };

    render(<ProductCard product={productWithoutCover} />);

    expect(screen.getByTestId('product-stub')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

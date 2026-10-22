export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number | null;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number; // Valor original em dólar (BigDecimal 'price' do backend)
  color: string | null;
  mark: string | null;
  categoryName: string;
  images: ProductImage[];
}

export interface SpringPage<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

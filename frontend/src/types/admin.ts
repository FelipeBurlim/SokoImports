import { ProductImage } from "@/types/product";

export interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  color: string | null;
  mark: string | null;
  categoryId: number;
  categoryName: string;
  active: boolean;
  images: ProductImage[];
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  color: string;
  mark: string;
}

/** Estado devolvido pelas server actions de formulário. */
export interface FormState {
  error?: string;
  success?: string;
  /** Valores enviados, para o formulário não "esquecer" o que foi digitado. */
  values?: Record<string, string>;
}

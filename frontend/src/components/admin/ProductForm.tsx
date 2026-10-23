"use client";

import { useActionState } from "react";
import { AdminProduct, FormState } from "@/types/admin";
import { Category } from "@/types/category";

interface ProductFormProps {
  mode: "create" | "edit";
  categories: Category[];
  product?: AdminProduct;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}

const initialState: FormState = {};

export default function ProductForm({
  mode,
  categories,
  product,
  action,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const v = state.values ?? {};

  return (
    <form action={formAction} className="admin-form" encType="multipart/form-data">
      {mode === "edit" && product && (
        <input type="hidden" name="id" value={product.id} />
      )}

      <div className="form-grid">
        <label className="form-field form-wide">
          <span>Nome *</span>
          <input
            type="text"
            name="name"
            maxLength={150}
            required
            defaultValue={v.name ?? product?.name ?? ""}
          />
        </label>

        <label className="form-field form-wide">
          <span>Descrição / configuração</span>
          <textarea
            name="description"
            rows={3}
            placeholder="Ex.: 256 GB · eSIM"
            defaultValue={v.description ?? product?.description ?? ""}
          />
        </label>

        <label className="form-field">
          <span>Preço em dólar (US$) *</span>
          <input
            type="text"
            name="price"
            inputMode="decimal"
            placeholder="1199.00"
            required
            defaultValue={v.price ?? (product ? String(product.price) : "")}
          />
        </label>

        <label className="form-field">
          <span>Categoria *</span>
          <select
            name="categoryId"
            required
            defaultValue={v.categoryId ?? (product ? String(product.categoryId) : "")}
          >
            <option value="" disabled>
              Selecione...
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Marca *</span>
          <input
            type="text"
            name="mark"
            maxLength={50}
            required
            defaultValue={v.mark ?? product?.mark ?? ""}
          />
        </label>

        <label className="form-field">
          <span>Cor(es) *</span>
          <input
            type="text"
            name="color"
            maxLength={50}
            placeholder="Orange, Blue"
            required
            defaultValue={v.color ?? product?.color ?? ""}
          />
          <small>Separe várias cores por vírgula.</small>
        </label>

        <label className="form-field form-wide">
          <span>{mode === "create" ? "Imagens" : "Adicionar imagens"}</span>
          <input
            type="file"
            name="images"
            multiple
            accept="image/webp,image/jpeg,image/png"
          />
          <small>
            WebP, JPEG ou PNG, até 5 MB cada. A primeira imagem enviada vira a
            foto do card.
          </small>
        </label>
      </div>

      {state.error && (
        <p className="form-message form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="form-message form-success" role="status">
          {state.success}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending
          ? "Salvando..."
          : mode === "create"
            ? "Cadastrar produto"
            : "Salvar alterações"}
      </button>
    </form>
  );
}

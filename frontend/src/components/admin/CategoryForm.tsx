"use client";

import { useActionState } from "react";
import { createCategoryAction } from "@/app/admin/actions";
import { FormState } from "@/types/admin";

const initialState: FormState = {};

export default function CategoryForm() {
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    initialState,
  );

  return (
    <form action={formAction} className="admin-inline-form">
      <label className="form-field">
        <span>Nova categoria</span>
        <input
          type="text"
          name="name"
          placeholder="Ex.: iPhone, MacBook, Acessórios"
          maxLength={100}
          required
        />
      </label>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Criando..." : "Criar categoria"}
      </button>

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
    </form>
  );
}

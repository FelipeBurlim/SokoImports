"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { FormState } from "@/types/admin";

const initialState: FormState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="admin-form">
      <label className="form-field">
        <span>Senha</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          autoFocus
        />
      </label>

      {state.error && (
        <p className="form-message form-error" role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

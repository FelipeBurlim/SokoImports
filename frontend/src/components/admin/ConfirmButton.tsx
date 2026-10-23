"use client";

import { ReactNode } from "react";

interface ConfirmButtonProps {
  message: string;
  className?: string;
  children: ReactNode;
}

/** Botão de envio de formulário que pede confirmação antes. */
export default function ConfirmButton({
  message,
  className = "btn btn-outline btn-danger",
  children,
}: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

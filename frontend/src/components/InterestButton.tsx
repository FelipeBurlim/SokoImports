"use client";

import { useState } from "react";
import { INSTAGRAM_URL } from "@/utils/instagram";

interface InterestButtonProps {
  message: string;
  className?: string;
}

/**
 * Copia a mensagem pronta e abre o Direct da loja no Instagram
 * (o ig.me não aceita texto pré-preenchido de forma confiável).
 */
export default function InterestButton({
  message,
  className = "btn btn-primary",
}: InterestButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      // Sem permissão de área de transferência: segue só abrindo o Direct
    }
  }

  return (
    <span className="interest">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        Tenho interesse
      </a>
      {copied && (
        <small role="status" className="interest-hint">
          Mensagem copiada! Cole no Direct.
        </small>
      )}
    </span>
  );
}
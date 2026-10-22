import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/utils/instagram";

export default function ContactCta() {
  return (
    <section id="contato" className="section-container">
      <div className="cta">
        <div>
          <span className="eyebrow">Atendimento pelo Instagram</span>
          <h2>Encontrou o produto ideal?</h2>
          <p>
            Envie a mensagem do produto para <strong>{INSTAGRAM_HANDLE}</strong>{" "}
            e confirme os detalhes diretamente com a loja.
          </p>
        </div>
        <a
          href={INSTAGRAM_URL}
          className="btn btn-light"
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir Direct
        </a>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: "Catálogo organizado",
    text: "Produtos separados por categoria, marca e configuração.",
  },
  {
    title: "Busca eficiente",
    text: "Filtros para comparar rapidamente as opções disponíveis no catálogo.",
  },
  {
    title: "Contato direto",
    text: "Mensagem pronta para enviar ao perfil oficial da loja.",
  },
  {
    title: "Navegação segura",
    text: "Sem cadastro, pagamentos ou coleta de informações pessoais.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="section-container">
      <div className="section-header">
        <span className="eyebrow">Por que consultar a SOKO Imports?</span>
        <h2>Uma experiência direta, clara e organizada.</h2>
        <p>
          Consulte configurações, cores e valores em um só lugar. Quando
          encontrar o produto ideal, fale diretamente com a loja pelo Instagram.
        </p>
      </div>

      <div className="features-grid">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="feature">
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

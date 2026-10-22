const FALLBACK_RATE = 5.38; // valor do dólar caso a API de câmbio falhe

export async function getUSDRate(): Promise<number> {
  try {
    const response = await fetch(
      "https://economia.awesomeapi.com.br/last/USD-BRL",
      {
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) throw new Error("Falha na resposta da API de câmbio");

    const data = await response.json();
    const rate = parseFloat(data?.USDBRL?.bid);
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Cotação inválida recebida da API");
    }
    return rate;
  } catch (error) {
    console.error("Erro ao buscar cotação, utilizando fallback:", error);
    return FALLBACK_RATE;
  }
}

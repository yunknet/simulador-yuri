const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** Formata um valor inteiro em reais, sem centavos: 45000 → "R$ 45.000". */
export function formatCurrency(value: number): string {
  return brlFormatter.format(value);
}

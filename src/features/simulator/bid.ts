/** Incremento fino do lance nos primeiros R$ 10 mil. */
const FINE_STEP = 500;
const FINE_LIMIT = 10000;

/**
 * Gera os valores possíveis do slider de lance:
 * de R$ 500 em R$ 500 até R$ 10 mil, depois no "step" do tipo de consórcio,
 * sempre terminando exatamente no valor do crédito.
 */
export function buildBidValues(credit: number, step: number): number[] {
  const values: number[] = [];

  for (let value = 0; value <= FINE_LIMIT && value <= credit; value += FINE_STEP) {
    values.push(value);
  }

  for (let value = Math.ceil((FINE_LIMIT + 1) / step) * step; value <= credit; value += step) {
    if (!values.includes(value)) values.push(value);
  }

  if (values[values.length - 1] !== credit) values.push(credit);

  return values;
}

/** Índice do valor mais próximo de `bid` dentro de `values`. */
export function closestIndex(values: readonly number[], bid: number): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) {
    if (Math.abs(values[i] - bid) < Math.abs(values[best] - bid)) best = i;
  }
  return best;
}

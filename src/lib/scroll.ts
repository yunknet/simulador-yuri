/**
 * Rola até um elemento respeitando o header fixo (via `scroll-padding-top`
 * definido no CSS) e a preferência de movimento reduzido do usuário.
 */
export function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ block: "start" });
}

/** Garante que o topo do elemento esteja visível (útil ao trocar de etapa no celular). */
export function ensureTopVisible(element: HTMLElement | null): void {
  if (!element) return;
  const headerOffset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const { top } = element.getBoundingClientRect();
  if (top < headerOffset || top > window.innerHeight * 0.5) {
    element.scrollIntoView({ block: "start" });
  }
}

import type { ReactNode } from "react";
import { SimulatorContext } from "./simulator-context";
import { useSimulator } from "./useSimulator";

/**
 * Disponibiliza o estado do simulador para a página inteira,
 * permitindo que outras seções (ex.: "O que você vai conquistar")
 * pré-selecionem o tipo de consórcio.
 */
export function SimulatorProvider({ children }: { children: ReactNode }) {
  const simulator = useSimulator();
  return <SimulatorContext.Provider value={simulator}>{children}</SimulatorContext.Provider>;
}

import { createContext, useContext } from "react";
import type { SimulatorState } from "./useSimulator";

export const SimulatorContext = createContext<SimulatorState | null>(null);

export function useSimulatorContext(): SimulatorState {
  const context = useContext(SimulatorContext);
  if (!context) throw new Error("useSimulatorContext deve ser usado dentro de <SimulatorProvider>.");
  return context;
}

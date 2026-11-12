import { formatCurrency } from "@/lib/format";
import { IMMEDIATE_BID_ID } from "./simulator.config";

interface SimulationSummary {
  typeId: string;
  credit: number;
  objective: string;
  bid: number;
  name: string;
}

/** Texto enviado ao WhatsApp ao concluir a simulação. */
export function buildSimulationMessage({ typeId, credit, objective, bid, name }: SimulationSummary): string {
  const lines = [
    "Olá! Fiz uma simulação no site do Yuri Soares.",
    "",
    "*Detalhes:*",
    `- Consórcio de: ${typeId}`,
    `- Valor do crédito: ${formatCurrency(credit)}`,
    `- Objetivo: ${objective}`,
  ];

  if (objective === IMMEDIATE_BID_ID) {
    lines.push(`- Valor do lance: ${formatCurrency(bid)}`);
  }

  lines.push("", `Meu nome é ${name.trim()}. Gostaria de ver as opções de parcelas!`);

  return lines.join("\n");
}

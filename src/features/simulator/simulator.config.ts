import { BookOpen, Bike, Car, Home, Landmark, TrendingUp, Wrench, Zap, type LucideIcon } from "lucide-react";

export interface ConsortiumType {
  /** Identificador enviado na mensagem do WhatsApp. */
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  min: number;
  max: number;
  step: number;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const consortiumTypes: readonly ConsortiumType[] = [
  { id: "Veículos", label: "Veículos", hint: "Carro novo ou seminovo", icon: Car, min: 45000, max: 300000, step: 5000 },
  { id: "Imóveis", label: "Imóveis", hint: "Casa, apartamento ou terreno", icon: Home, min: 100000, max: 1000000, step: 10000 },
  { id: "Motos", label: "Motos", hint: "Sua moto sem juros", icon: Bike, min: 15000, max: 80000, step: 1000 },
  { id: "Serviços", label: "Serviços", hint: "Cirurgia, reforma etc.", icon: Wrench, min: 15000, max: 150000, step: 5000 },
  { id: "Alavancagem financeira", label: "Alavancagem financeira", hint: "Multiplique seu capital", icon: TrendingUp, min: 100000, max: 2000000, step: 20000 },
  { id: "Alavancagem patrimonial", label: "Alavancagem patrimonial", hint: "Patrimônio no longo prazo", icon: Landmark, min: 200000, max: 5000000, step: 50000 },
];

export const IMMEDIATE_BID_ID = "Lance imediato";

export const objectives: readonly Objective[] = [
  {
    id: "Investimento",
    title: "Investimento",
    description: "Quero usar o consórcio como forma de investimento e patrimônio",
    icon: TrendingUp,
  },
  {
    id: IMMEDIATE_BID_ID,
    title: "Lance imediato",
    description: "Pretendo dar um lance e ser contemplado o mais rápido possível",
    icon: Zap,
  },
  {
    id: "Quero entender mais",
    title: "Quero entender mais",
    description: "Ainda estou conhecendo o consórcio e quero tirar dúvidas",
    icon: BookOpen,
  },
];

export const STEPS = ["Simulação", "Objetivo", "Seus dados"] as const;

export function findConsortiumType(id: string): ConsortiumType | undefined {
  return consortiumTypes.find((type) => type.id === id);
}

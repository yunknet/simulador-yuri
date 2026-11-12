import { useCallback, useMemo, useState } from "react";
import { buildBidValues, closestIndex } from "./bid";
import { consortiumTypes, findConsortiumType, IMMEDIATE_BID_ID, STEPS, type ConsortiumType } from "./simulator.config";

export type Step = 1 | 2 | 3;

export const MIN_NAME_LENGTH = 2;

/** Estado e regras do simulador, separados da interface. */
export function useSimulator() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<ConsortiumType>(consortiumTypes[0]);
  const [credit, setCredit] = useState(consortiumTypes[0].min);
  const [objective, setObjective] = useState("");
  const [rawBid, setRawBid] = useState(0);
  const [name, setName] = useState("");

  const bidValues = useMemo(() => buildBidValues(credit, type.step), [credit, type.step]);
  const bidIndex = useMemo(() => closestIndex(bidValues, rawBid), [bidValues, rawBid]);
  // O lance nunca pode ficar maior que o crédito, mesmo se o crédito for reduzido depois.
  const bid = bidValues[bidIndex];

  const selectType = useCallback((typeId: string) => {
    const next = findConsortiumType(typeId);
    if (!next) return;
    setType(next);
    setCredit(next.min);
    setRawBid(0);
  }, []);

  const setBidIndex = useCallback((index: number) => setRawBid(bidValues[index] ?? 0), [bidValues]);

  const canAdvance = step === 1 || (step === 2 && objective !== "");
  const canSubmit = name.trim().length >= MIN_NAME_LENGTH;

  return {
    step,
    stepLabel: STEPS[step - 1],
    totalSteps: STEPS.length,
    goTo: setStep,
    next: () => canAdvance && setStep((s) => (s < 3 ? ((s + 1) as Step) : s)),
    back: () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s)),
    canAdvance,
    canSubmit,

    type,
    selectType,
    credit,
    setCredit,

    objective,
    setObjective,
    isImmediateBid: objective === IMMEDIATE_BID_ID,
    bid,
    bidIndex,
    bidValues,
    setBidIndex,

    name,
    setName,
  };
}

export type SimulatorState = ReturnType<typeof useSimulator>;

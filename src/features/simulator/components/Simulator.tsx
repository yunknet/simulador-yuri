import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ensureTopVisible } from "@/lib/scroll";
import { sendLeadToWhatsApp } from "@/lib/whatsapp";
import { trackSimulationLead } from "@/lib/tracking";
import { buildSimulationMessage } from "../message";
import { useSimulatorContext } from "../simulator-context";
import { StepContact } from "./StepContact";
import { StepIndicator } from "./StepIndicator";
import { StepObjective } from "./StepObjective";
import { StepType } from "./StepType";

export function Simulator() {
  const sim = useSimulatorContext();
  const [sending, setSending] = useState(false);
  const cardRef = useRef<HTMLFormElement>(null);
  const isFirstRender = useRef(true);
  const leadTracked = useRef(false);

  // No celular, ao trocar de etapa, garante que o topo do card fique visível.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    ensureTopVisible(cardRef.current);
  }, [sim.step]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (sim.step < 3) {
      sim.next();
      return;
    }
    if (!sim.canSubmit || sending || !sim.type) return;

    setSending(true);
    try {
      if (!leadTracked.current) {
        trackSimulationLead();
        leadTracked.current = true;
      }
      await sendLeadToWhatsApp(
        buildSimulationMessage({
          typeId: sim.type.id,
          credit: sim.credit,
          objective: sim.objective,
          bid: sim.bid,
          name: sim.name,
        }),
        { clientName: sim.name.trim(), source: "simulador" },
      );
    } finally {
      // No desktop o WhatsApp abre em outra aba; libera o botão para um novo envio.
      setTimeout(() => setSending(false), 1500);
    }
  };

  return (
    <form
      ref={cardRef}
      onSubmit={handleSubmit}
      aria-label="Simulador de consórcio"
      className="overflow-hidden rounded-2xl bg-white text-foreground shadow-float ring-1 ring-black/5 sm:rounded-3xl"
    >
      <div className="border-b border-border px-5 py-4 sm:px-8">
        <StepIndicator current={sim.step} />
      </div>

      <div key={sim.step} className="px-5 py-6 duration-300 animate-in fade-in slide-in-from-right-2 sm:px-8 sm:py-8">
        {sim.step === 1 && <StepType sim={sim} />}
        {sim.step === 2 && <StepObjective sim={sim} />}
        {sim.step === 3 && <StepContact sim={sim} />}
      </div>

      <div className="flex gap-3 border-t border-border bg-secondary/40 px-5 py-4 sm:px-8">
        {sim.step > 1 && (
          <Button type="button" variant="outline" size="xl" onClick={sim.back} className="shrink-0 bg-white px-4 sm:px-6" aria-label="Voltar">
            <ChevronLeft className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
        )}

        {sim.step < 3 ? (
          <Button type="submit" size="xl" disabled={!sim.canAdvance} className="flex-1">
            {sim.step === 1 && !sim.type ? (
              "Escolha o tipo acima"
            ) : (
              <>
                Próximo <ChevronRight className="h-5 w-5" aria-hidden />
              </>
            )}
          </Button>
        ) : (
          <Button type="submit" variant="whatsapp" size="xl" disabled={!sim.canSubmit || sending} className="flex-1">
            {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
            {sending ? "Abrindo WhatsApp..." : "Enviar no WhatsApp"}
          </Button>
        )}
      </div>
    </form>
  );
}

import { CheckCircle2, ShieldCheck, Trophy } from "lucide-react";
import avatar from "@/assets/yuri-hero.webp";
import { Logo } from "@/components/layout/Logo";
import { SIMULATOR_ANCHOR, siteConfig } from "@/config/site";
import { Simulator, SimulatorProvider } from "@/features/simulator";

const perks = [
  "Sem juros e sem entrada",
  "Parcelas reduzidas até a contemplação",
  "Planos flexíveis de 36 a 240 meses",
  "Use o lance embutido para adiantar seu bem",
] as const;

/**
 * Página única do simulador (destino dos anúncios "Saiba mais").
 * No celular o formulário aparece já na primeira tela.
 */
const App = () => (
  <SimulatorProvider>
    <div className="flex min-h-[100svh] flex-col bg-navy-gradient text-white">
      <header className="container flex h-[var(--header-height)] items-center justify-between">
        <Logo tone="dark" />
        <span className="hidden items-center gap-1.5 text-xs font-medium text-white/60 sm:flex">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden /> Simulação gratuita e sem compromisso
        </span>
      </header>

      <main className="container flex-1 pb-12 pt-2 sm:pt-6 lg:pb-16">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Introdução: curta no celular para o simulador ficar visível logo de cara */}
          <section aria-labelledby="page-title" className="lg:col-span-5 lg:pt-10">
            <div className="hidden items-center gap-3 sm:flex">
              <img src={avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover object-top ring-2 ring-accent/60" />
              <div className="leading-tight">
                <p className="font-display font-bold">{siteConfig.name}</p>
                <p className="text-sm text-white/65">{siteConfig.role}</p>
              </div>
            </div>

            <h1 id="page-title" className="text-[1.85rem] font-extrabold sm:mt-5 leading-[1.1] sm:text-4xl lg:text-5xl">
              Simule e realize seu <span className="text-gold-gradient">sonho</span> hoje
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-white/75 sm:mt-3 sm:text-lg">
              Sem juros abusivos e sem entrada. Em menos de 1 minuto você descobre o melhor plano e recebe os valores no WhatsApp.
            </p>

            <ul className="mt-6 hidden space-y-3 lg:block">
              {perks.map((item) => (
                <li key={item} className="flex items-start gap-3 font-medium text-white/85">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden /> {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 hidden items-center gap-2 text-sm text-white/60 lg:flex">
              <Trophy className="h-4 w-4 text-accent" aria-hidden /> Mais de {siteConfig.yearsOfExperience} anos ajudando pessoas a conquistarem seus bens
            </p>
          </section>

          <div id={SIMULATOR_ANCHOR} className="lg:col-span-7">
            <Simulator />
          </div>

          {/* Benefícios abaixo do simulador no celular */}
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:hidden">
            {perks.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-3.5 text-[15px] font-medium text-white/85 ring-1 ring-white/10">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden /> {item}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-xs text-white/45">
        <div className="container space-y-1">
          <p>
            © {new Date().getFullYear()} Yuri Soares Consórcios · CNPJ {siteConfig.cnpj}
          </p>
          <p>Simulação ilustrativa. Valores finais e condições são confirmados no atendimento.</p>
        </div>
      </footer>
    </div>
  </SimulatorProvider>
);

export default App;

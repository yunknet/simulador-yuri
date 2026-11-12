import { getNextTeamMember, getNextTeamMemberAsync, type TeamMember } from "@/lib/teamRotation";
import { redirectToWhatsApp, trackWhatsAppClick } from "@/lib/tracking";

/** Tempo máximo esperando a API do rodízio antes de usar o rodízio local. */
const ROTATION_TIMEOUT_MS = 350;

/** Monta o link do WhatsApp com a mensagem corretamente codificada. */
export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Escolhe o atendente pelo rodízio da equipe (API da VPS, com fallback local
 * se ela demorar ou falhar), para nunca travar o clique do cliente.
 */
async function resolveTeamMember(clientName?: string): Promise<TeamMember> {
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
  const fallback = new Promise<TeamMember>((resolve) => {
    fallbackTimer = setTimeout(() => resolve(getNextTeamMember(clientName)), ROTATION_TIMEOUT_MS);
  });

  try {
    return await Promise.race([getNextTeamMemberAsync(clientName), fallback]);
  } catch {
    return getNextTeamMember(clientName);
  } finally {
    // Se a API respondeu antes, cancela o fallback: sem isso o rodízio
    // avançava duas vezes por cliente (e registrava o lead em dobro).
    clearTimeout(fallbackTimer);
  }
}

interface SendLeadOptions {
  clientName?: string;
  /** Origem do clique, enviada ao Pixel/GA (ex.: "simulador"). */
  source: string;
}

/** Registra o clique, escolhe o atendente do rodízio e abre o WhatsApp. */
export async function sendLeadToWhatsApp(message: string, { clientName, source }: SendLeadOptions): Promise<void> {
  trackWhatsAppClick(source);
  const member = await resolveTeamMember(clientName);
  redirectToWhatsApp(buildWhatsAppUrl(member.phone, message));
}

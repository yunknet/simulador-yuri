export interface TeamMember {
  id: string;
  name: string;
  phone: string; // Formato internacional completo com 9 dígitos (wa.me)
  displayPhone: string;
}

/**
 * Lista dos membros da equipe para o rodízio de atendimento:
 * - Yuri Soares: +55 (38) 99111-8169 -> 5538991118169
 * - Equipe Yuri (Norte de Minas): +55 (38) 99842-2719 -> 5538998422719
 */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "yuri",
    name: "Yuri Soares",
    phone: "5538991118169",
    displayPhone: "+55 (38) 99111-8169",
  },
  {
    id: "equipe-2",
    name: "Equipe Yuri (Norte de Minas)",
    phone: "5538998422719",
    displayPhone: "+55 (38) 99842-2719",
  },
];

const STORAGE_KEY_INDEX = "yuri_team_rotation_last_index";
const STORAGE_KEY_TIMESTAMP = "yuri_team_rotation_last_time";

// URL opcional da API da VPS para rodízio global (ex: VITE_API_URL=https://api.seusite.com.br)
const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Sincroniza em background com o servidor para registrar quem recebeu o lead,
 * sem travar o clique nem o popup do WhatsApp no celular.
 */
function notifyServerDispatch(memberPhone: string, clientName?: string) {
  if (!API_URL) return;
  try {
    fetch(`${API_URL}/api/team/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: memberPhone, clientName }),
    }).catch(() => {
      // Ignora erro de rede em background
    });
  } catch {
    // Silencioso
  }
}

/**
 * Retorna o próximo membro da equipe que está há mais tempo sem receber cliente
 * e avança o rodízio para garantir distribuição justa.
 * 
 * Lógica:
 * 1. Para novos visitantes: utiliza a alternância por hora do dia (hora % 2) para distribuir
 *    visitantes de celulares/computadores diferentes igualmente entre as pessoas da equipe.
 * 2. A cada clique/envio: avança imediatamente para o próximo atendente e atualiza o histórico,
 *    garantindo que quem recebeu por último não receba o próximo.
 */
export function getNextTeamMember(clientName?: string): TeamMember {
  if (TEAM_MEMBERS.length === 0) {
    throw new Error("Nenhum membro da equipe cadastrado.");
  }

  if (TEAM_MEMBERS.length === 1) {
    return TEAM_MEMBERS[0];
  }

  let nextIndex = 0;

  try {
    const storedIndexStr = localStorage.getItem(STORAGE_KEY_INDEX);

    if (storedIndexStr !== null) {
      const lastIndex = parseInt(storedIndexStr, 10);
      if (!isNaN(lastIndex)) {
        // Quem está há mais tempo sem receber é o próximo da fila
        nextIndex = (lastIndex + 1) % TEAM_MEMBERS.length;
      } else {
        nextIndex = new Date().getHours() % TEAM_MEMBERS.length;
      }
    } else {
      // Primeiro acesso deste dispositivo: distribui pela hora atual
      nextIndex = new Date().getHours() % TEAM_MEMBERS.length;
    }

    localStorage.setItem(STORAGE_KEY_INDEX, nextIndex.toString());
    localStorage.setItem(STORAGE_KEY_TIMESTAMP, Date.now().toString());
  } catch {
    nextIndex = new Date().getHours() % TEAM_MEMBERS.length;
  }

  const selectedMember = TEAM_MEMBERS[nextIndex];

  // Notifica o backend em background se houver servidor configurado
  notifyServerDispatch(selectedMember.phone, clientName);

  return selectedMember;
}

/**
 * Consulta o membro atual sem avançar a fila (apenas leitura).
 */
export function getCurrentTeamMember(): TeamMember {
  try {
    const storedIndexStr = localStorage.getItem(STORAGE_KEY_INDEX);
    if (storedIndexStr !== null) {
      const idx = parseInt(storedIndexStr, 10);
      if (!isNaN(idx) && idx >= 0 && idx < TEAM_MEMBERS.length) {
        return TEAM_MEMBERS[idx];
      }
    }
    const hourIdx = new Date().getHours() % TEAM_MEMBERS.length;
    return TEAM_MEMBERS[hourIdx];
  } catch {
    return TEAM_MEMBERS[0];
  }
}

/**
 * Consulta a API global na VPS para pegar quem está há mais tempo sem receber.
 * Se a API responder, usa o membro do banco de dados PostgreSQL da VPS.
 * Se a API falhar ou demorar, faz fallback imediato para o rodízio local,
 * garantindo 100% de disponibilidade sem travar a navegação.
 */
export async function getNextTeamMemberAsync(clientName?: string): Promise<TeamMember> {
  const targetUrl = API_URL ? `${API_URL}/api/team/next` : "/api/team/next";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data?.member?.phone) {
        const found = TEAM_MEMBERS.find((m) => m.phone === data.member.phone);
        if (found) return found;
      }
    }
  } catch {
    // Falha silenciosa ou offline: usa o fallback local
  }

  return getNextTeamMember(clientName);
}

/**
 * Gera a URL do WhatsApp para o próximo membro da equipe no rodízio
 */
export function getTeamWhatsAppUrl(messageText?: string, clientName?: string): string {
  const member = getNextTeamMember(clientName);
  const baseUrl = `https://wa.me/${member.phone}`;
  if (messageText) {
    return `${baseUrl}?text=${messageText}`;
  }
  return baseUrl;
}


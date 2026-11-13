# Simulador Yuri Soares

Página única com o **simulador gratuito de consórcio**, feita para ser o destino dos anúncios ("Saiba mais"). É o mesmo simulador do site [yuriconsorcio](https://github.com/yunknet/yuriconsorcio), de ponta a ponta:

1. O visitante escolhe o tipo de consórcio e o valor do crédito
2. Escolhe o objetivo (com slider de lance para "Lance imediato")
3. Informa o nome e é levado ao **WhatsApp** com a simulação preenchida
4. O atendente é escolhido pelo **rodízio** entre os dois consultores

## Como funciona o rodízio

| Situação | Quem atende |
| --- | --- |
| API com banco configurado | Quem está **há mais tempo sem receber** cliente (global, no PostgreSQL) |
| Sem banco / API lenta (> 350 ms) / fora do ar | Rodízio **local** no navegador, alternando entre os dois números |

O site nunca trava esperando a API: se ela não responder a tempo, o rodízio local assume.

Consultores (em `src/lib/teamRotation.ts` e `server/db.js`):

- Yuri Soares — (38) 99111-8169
- Equipe Yuri (Norte de Minas) — (38) 99842-2719

Para desativar um consultor sem mexer no código: `UPDATE team_members SET is_active = FALSE WHERE phone = '55...';`

> Se o simulador e o site principal apontarem para o **mesmo banco**, o rodízio é compartilhado entre os dois.

## Rastreamento

- UTMs (`utm_*`, `fbclid`, `gclid`…) são salvos ao abrir a página
- Ao enviar para o WhatsApp: evento `Contact` no Meta Pixel, `click_whatsapp` no GA e `whatsapp_click` no GTM (`dataLayer`)
- **Meta Pixel `1845894369781850`** já incluído (código oficial no `<head>`, com `PageView`). Para trocar, defina `META_PIXEL_ID` no Environment; `META_PIXEL_ID=off` desativa

## Deploy no Easypanel

Toda a configuração fica na aba **Environment** do app. Não precisa de Build Args.

1. **Banco** (recomendado): *+ Service → Postgres*. Abra o serviço e copie a **Internal Connection URL**.
2. **App**: *+ Service → App* → Source: GitHub `yunknet/simulador-yuri`, branch `main` → Build: **Dockerfile**.
3. Aba **Environment** do app — cole (uma por linha):
   ```
   DATABASE_URL=postgres://...   ← a URL copiada no passo 1
   ```
4. Aba **Domains**: adicione o domínio, porta **3000**.
5. **Deploy**. Teste em `https://seu-dominio/api/health` — deve mostrar `"database":"conectado"`.

O Meta Pixel já vem configurado — não precisa de variável.
O domínio das prévias de link (WhatsApp/Instagram) é detectado sozinho; para forçar um, use `SITE_URL`.

Para usar o mesmo banco do site principal (fila de rodízio compartilhada), use em `DATABASE_URL` o banco `yurirodizio` já existente.

## Desenvolvimento

Requer Node 20.19+.

```sh
npm install
npm run dev        # página em http://localhost:8080
npm run dev:api    # (opcional) API em http://localhost:3000 — precisa de DATABASE_URL
```

| Script | O que faz |
| --- | --- |
| `npm run build` | Checagem de tipos + build do front |
| `npm start` | Sobe o servidor de produção (página + API) na porta 3000 |
| `npm run lint` / `npm run typecheck` | Qualidade de código |

## Estrutura

```
src/
├── App.tsx                   # a página do simulador
├── features/simulator/       # simulador: regras (hook), opções, mensagem e telas
├── lib/
│   ├── whatsapp.ts           # envio do lead: rastreia, escolhe atendente, abre o WhatsApp
│   ├── teamRotation.ts       # rodízio (API + fallback local)
│   └── tracking.ts           # UTMs, eventos Pixel/GA, redirecionamento compatível com apps
server/
├── index.js                  # Express: /api/team/next, /api/team/dispatch, /api/health + arquivos do site
└── db.js                     # conexão e criação automática das tabelas
```

Onde editar:

| Quero mudar… | Arquivo |
| --- | --- |
| Tipos de consórcio, valores mín./máx., objetivos | `src/features/simulator/simulator.config.ts` |
| Mensagem enviada ao WhatsApp | `src/features/simulator/message.ts` |
| Números dos consultores | `src/lib/teamRotation.ts` e `server/db.js` |
| Textos da página | `src/App.tsx` |

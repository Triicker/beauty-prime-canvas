# LOMA Clinic & Beauty Hair — Website

Site oficial da **LOMA Clinic & Beauty Hair**, fundado por Marina Loreti. Espaço premium de transformação capilar e bem-estar localizado em Silveira — Torres Vedras.

---

## Visão Geral do Projeto

Website institucional multi-página com agendamento, loja, galeria e área de profissionais. Construído com tecnologias modernas e deployado no Render (Node.js SSR).

O projeto já possui backend integrado ao PostgreSQL do Render para conteúdo administrativo,
agendamentos, submissões de formulários e envio de emails via Resend.

---

## Stack Tecnológica

| Camada              | Tecnologia                                                          |
| ------------------- | ------------------------------------------------------------------- |
| Framework           | [TanStack Start](https://tanstack.com/start) (React + SSR)          |
| Roteamento          | [TanStack Router](https://tanstack.com/router) — file-based routing |
| Estilos             | [Tailwind CSS v4](https://tailwindcss.com/)                         |
| Componentes UI      | [Radix UI](https://www.radix-ui.com/) via shadcn/ui                 |
| Internacionalização | [react-i18next](https://react.i18next.com/) (PT + EN)               |
| Estado global       | Zustand (`src/store/cart.ts`)                                       |
| Banco de dados      | PostgreSQL no Render (`DATABASE_URL`)                               |
| Email transacional  | Resend (`RESEND_API_KEY`)                                           |
| Deploy              | [Render](https://render.com/) (Node.js SSR)                         |
| Bundler             | Vite                                                                |
| Linguagem           | TypeScript                                                          |

---

## Estrutura de Pastas

```
src/
├── assets/             # Imagens (hero, serviços, galeria, produtos, etc.)
├── components/         # Componentes globais reutilizáveis
│   ├── Header.tsx      # Navegação principal
│   ├── Footer.tsx      # Rodapé com links e newsletter
│   ├── CartDrawer.tsx  # Carrinho lateral (loja)
│   ├── Reveal.tsx      # Animação de entrada ao fazer scroll
│   ├── SectionHeading.tsx
│   └── ui/             # Componentes shadcn/ui (botões, dialogs, tabs, etc.)
├── hooks/
│   └── use-mobile.tsx
├── i18n/
│   ├── index.ts        # Configuração do i18next
│   ├── pt.ts           # Traduções PT (fonte principal de textos)
│   └── en.ts           # Traduções EN (espelho de pt.ts)
├── lib/
│   ├── utils.ts        # cn() e helpers
│   └── error-page.ts
├── routes/             # Páginas (uma por rota)
│   ├── __root.tsx      # Layout raiz (Header + Footer + Cart)
│   ├── index.tsx       # Home (Hero, Sobre, Serviços, Produtos, Galeria, Testemunhos, CTA)
│   ├── sobre.tsx       # Página Sobre
│   ├── servicos.tsx    # Catálogo de serviços
│   ├── agendamento.tsx # Agendamento online (3 passos)
│   ├── loja.tsx        # Loja / Boutique
│   ├── galeria.tsx     # Galeria de trabalhos
│   ├── profissionais.tsx # Aluguer de espaços para profissionais
│   ├── contactos.tsx   # Contactos, mapa e formulário
│   └── routeTree.gen.ts # Gerado automaticamente pelo TanStack Router
├── lib/
│   ├── admin/          # Acesso PostgreSQL, CRUD admin e agenda própria
│   └── email/          # Helper Resend + registro em form_submissions
├── store/
│   └── cart.ts         # Estado do carrinho com Zustand
├── styles.css          # Design system (variáveis CSS, tipografia, utilitários)
├── router.tsx
├── server.ts
└── start.ts
```

---

## Como Correr Localmente

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Arrancar o servidor em produção (após build)
npm start

# Preview do build
npm run preview
```

---

## Como Fazer Alterações de Conteúdo

### Textos e Traduções

**Quase todos os textos visíveis no site estão em:**

- `src/i18n/pt.ts` — versão portuguesa (editar aqui primeiro)
- `src/i18n/en.ts` — versão inglesa (manter sincronizado com pt.ts)

A estrutura é um objeto tipado. Exemplos:

- `home.*` — textos da página inicial
- `about.*` — página Sobre (história, missão, valores)
- `services.list` — lista de serviços (nome, descrição, preço, duração)
- `contact.*` — morada, horário, email
- `booking.professionals` — nomes dos profissionais disponíveis

### Cores

As cores estão definidas em `src/styles.css` como variáveis CSS dentro de `:root`:

- `--primary` / `--gold` → Ouro dourado
- `--background` / `--cocoa` → Castanho cacau de fundo
- `--cream` → Creme/off-white

### Tipografia

As fontes display e sans estão definidas em `src/styles.css` na secção `@theme inline`:

```css
--font-display: "Cormorant Garamond", ...;
--font-sans: "Inter", ...;
```

Para mudar, substituir os valores e atualizar o `<link>` de Google Fonts no `__root.tsx`.

### Imagens

Todas as imagens ficam em `src/assets/`. Para substituir uma imagem, basta colocar o novo ficheiro com o mesmo nome, ou atualizar o import no ficheiro de rota correspondente.

### Adicionar uma Nova Página

1. Criar `src/routes/nova-pagina.tsx` com `createFileRoute('/nova-pagina')`.
2. O TanStack Router gera automaticamente a rota em `routeTree.gen.ts` (ao correr `npm run dev`).
3. Adicionar o link de navegação em `src/components/Header.tsx` e `src/i18n/pt.ts` (secção `nav`).

### Banco, Admin e Conteúdo Dinâmico

O site usa PostgreSQL no Render. A URL deve estar em `DATABASE_URL`.

Arquivos importantes:

- `db/schema.sql` — estrutura base completa.
- `db/add-booking-appointments.sql` — estrutura aditiva da agenda própria.
- `db/add-public-rate-limits.sql` — estrutura de proteção contra abuso nos formulários públicos.
- `db/seed-admin.sql` — criação do usuário admin.
- `src/lib/admin/*.server.ts` — regras server-side de CRUD, agenda e dashboard.

O painel admin permite gerir:

- serviços
- produtos
- profissionais
- espaços/cadeiras
- galeria
- banners de marketing da home
- agendamentos
- dashboard inicial com resumo operacional

### Emails e Formulários

O envio real de emails usa Resend através de `src/lib/email/mailer.server.ts`.
Todo formulário operacional deve passar por `sendSiteEmail`, pois ele:

- cria registro em `form_submissions`;
- envia email interno para `EMAIL_TO`;
- usa `replyTo` com o email do cliente quando existir;
- envia confirmação automática ao cliente quando `confirmation.enabled = true`;
- tenta novamente envios com falha transitória antes de marcar erro final;
- registra erro no payload se o envio falhar.

Variáveis necessárias no Render e no `.env` local:

```env
DATABASE_URL=...
ADMIN_SESSION_SECRET=...
RESEND_API_KEY=...
EMAIL_FROM=LOMA <no-reply@lomaexperience.com>
EMAIL_TO=...
EMAIL_REPLY_TO=...
EMAIL_LOGO_URL=https://midiasave-5c064.web.app/logo-lomaa2.png
RATE_LIMIT_SALT=...
NODE_ENV=production
```

Para o Resend aceitar `EMAIL_FROM` com `@lomaexperience.com`, o domínio precisa estar
verificado no Resend. Os registros MX/TXT/DKIM devem ser criados no provedor DNS
autoritativo do domínio. Se o Resend continuar em `Pending` ou retornar `403 Domain not
verified`, confirme os nameservers públicos antes de editar o DNS:

```bash
nslookup -type=NS lomaexperience.com
nslookup -type=TXT send.lomaexperience.com
nslookup -type=MX send.lomaexperience.com
nslookup -type=TXT resend._domainkey.lomaexperience.com
```

Em Junho de 2026, o DNS público de `lomaexperience.com` responde pelos nameservers da
Hostinger (`horizon.dns-parking.com` / `orbit.dns-parking.com`). Portanto, registros
adicionados apenas no Cloudflare não serão vistos pelo Resend enquanto esses nameservers
continuarem ativos.

`RATE_LIMIT_SALT` deve estar configurado em produção para gerar hashes estáveis dos
identificadores de rate limit sem guardar IP/user-agent em texto puro. Se faltar, o código usa
apenas um fallback fixo de desenvolvimento e emite aviso no servidor; nunca usa `DATABASE_URL`
como salt.

O pool PostgreSQL usa limites conservadores para Render por padrão:

- `DATABASE_POOL_MAX=5`;
- `DATABASE_IDLE_TIMEOUT_MS=30000`;
- `DATABASE_CONNECTION_TIMEOUT_MS=5000`.

Essas variáveis são opcionais; só altere se houver necessidade operacional clara.

Se `EMAIL_LOGO_URL` não for informado, o email usa o fallback público
`https://midiasave-5c064.web.app/logo-lomaa2.png`. Evite apontar para assets internos do build do
Render, porque eles podem mudar de nome a cada deploy.

Formulários atualmente integrados:

- `/api/contact` — contacto;
- `/api/newsletter` — newsletter;
- `/api/cart-request` — lista de produtos do carrinho, sem pagamento;
- `/api/booking/availability` — consulta pública de disponibilidade;
- `/api/booking` — pedido de agendamento com bloqueio por profissional;
- `/api/professional-inquiry` — candidatura de profissionais.

Os endpoints públicos usam rate limit server-side em `src/lib/security/rate-limit.server.ts`,
com contagem persistida em `public_rate_limits` no PostgreSQL:

- `/api/contact`: 5 envios a cada 10 minutos;
- `/api/newsletter`: 3 envios por hora;
- `/api/cart-request`: 5 envios a cada 15 minutos;
- `/api/booking/availability`: 80 consultas a cada 5 minutos;
- `/api/booking`: 8 envios a cada 15 minutos;
- `/api/professional-inquiry`: 3 envios por hora.

A tabela `public_rate_limits` é criada defensivamente pelo backend quando necessário. Registros
antigos são limpos na inicialização do processo e depois em intervalo controlado de 1 hora, evitando
queries aleatórias de limpeza em cada request.

Regra para próximas alterações: não criar envio direto com `fetch` para terceiros no frontend.
Crie ou ajuste uma rota em `src/routes/api.*.tsx`, valide com `zod`, chame `sendSiteEmail`
aplique `enforceRateLimit` quando a rota for pública e mantenha o payload completo em
`form_submissions`.

### Agenda Própria

O agendamento não usa Cal.com. O fluxo atual é próprio:

- serviços e profissionais vêm do PostgreSQL;
- disponibilidade é consultada em `/api/booking/availability`;
- a reserva é criada em `appointments`;
- datas e horários são tratados em `Europe/Lisbon`;
- o expediente público padrão é segunda a sábado, das 09:00 às 19:00;
- a grade pública é recalculada no backend conforme a duração real do serviço;
- horários são bloqueados por `professional_id`, com transação e trava no PostgreSQL;
- o banco também possui constraint de sobreposição para evitar duas marcações simultâneas para o mesmo profissional;
- o servidor valida duração do serviço, horário passado, dias fechados, expediente e sobreposição de intervalos;
- o frontend apenas exibe a disponibilidade retornada pelo backend e limpa o horário escolhido se ele deixar de ser válido;
- dois profissionais diferentes podem atender no mesmo horário;
- o admin acompanha tudo em `/admin/agendamentos`;
- o admin pode filtrar por data, profissional, serviço e status;
- o admin pode confirmar, cancelar, reagendar, copiar contacto, abrir WhatsApp e reenviar confirmação;
- o histórico de alterações fica em `appointment_events`;
- o botão de Google Calendar no admin apenas monta um evento manual para a equipa adicionar.

Para preparar o banco, rode `db/add-booking-appointments.sql` no DBeaver conectado ao banco do Render.

As verificações de existência das tabelas `appointments` e `appointment_events` são cacheadas em
memória após a primeira confirmação positiva, reduzindo consultas repetidas de `to_regclass`.

Se a constraint de sobreposição falhar ao rodar o SQL, verifique se já existem agendamentos
duplicados para o mesmo profissional/horário e corrija esses registros antes de executar novamente.

Não é necessária alteração de banco para esta regra: a duração continua vindo de `services.duration_label`,
e a validação usa `appointments.starts_at`, `appointments.ends_at`, `appointments.duration_minutes`
e `appointments.professional_id`.

### Painel Admin

O `/admin` possui um dashboard inicial para operação diária:

- agendamentos de hoje;
- próximos agendamentos;
- pedidos de agenda pendentes;
- novas mensagens de formulários;
- inscritos na newsletter;
- produtos mais solicitados pelo carrinho.

As ações de agenda ficam em `/admin/agendamentos`; os demais CRUDs ficam nas rotas específicas de
serviços, produtos, profissionais, marketing e galeria.

### Documentação Operacional

- `docs/manual-admin-cliente-loma.md` — guia para a cliente operar produtos, serviços, profissionais, banners, agenda e candidaturas no admin.
- `docs/render-admin-setup.md` — configuração técnica do Render/PostgreSQL/admin.
- `docs/booking-admin-setup.md` — estrutura técnica da agenda própria.
- `docs/proximos-passos-loma.md` — recomendações de melhorias futuras.

### Adicionar FAQ

Criar `src/routes/faq.tsx` e adicionar a chave `faq` em `pt.ts` e `en.ts` com a estrutura de perguntas/respostas.

---

## Informações da Marca

| Campo                | Valor                            |
| -------------------- | -------------------------------- |
| Nome                 | LOMA Clinic & Beauty Hair        |
| Fundadora            | Marina Loreti                    |
| Localização          | Silveira — Torres Vedras         |
| NIF                  | 233249168                        |
| Email                | Lomahairspa@gmail.com            |
| Cor primária (ouro)  | `#f4d183`                        |
| Cor de fundo (cacau) | `#7d563d`                        |
| Cor neutra           | `#e6e6e6`                        |
| Fontes (marketing)   | Safira March, Quicksand, Poppins |

---

## Deploy

O site é deployado no **[Render](https://render.com/)** como um serviço Node.js:

| Campo         | Valor                        |
| ------------- | ---------------------------- |
| Build Command | `npm run build`              |
| Start Command | `node dist/server/server.js` |
| Node Version  | 20+                          |
| Health Check  | `/api/health`                |

O domínio `lomaexperience.com` aponta para o Render (`www` via CNAME para o serviço Render e
apex via A record do Render). Confirme sempre qual provedor é autoritativo pelos nameservers
públicos antes de configurar registros de email, pois o Resend só valida DNS publicado no
provedor autoritativo.

O endpoint `/api/health` responde `200` quando a aplicação consegue executar `select 1` no
PostgreSQL e `503` quando o banco não está configurado ou não responde. Use esse caminho em
Health Check Path no Render.

---

## Notas de Desenvolvimento

- O roteador gera `routeTree.gen.ts` automaticamente — **não editar manualmente**.
- O carrinho usa Zustand com persistência (localStorage).
- Os formulários operacionais usam backend TanStack Start + Resend + `form_submissions`.
- O carrinho não tem checkout/pagamento; ao finalizar, envia uma lista de produtos por email.
- A agenda é própria no PostgreSQL, com bloqueio por profissional e sem dependência de Cal.com.
- As imagens devem ser otimizadas antes de colocar em `src/assets/` (recomendado: WebP, máx. 2000px de largura).

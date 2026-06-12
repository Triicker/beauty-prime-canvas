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
- `db/seed-admin.sql` — criação do usuário admin.
- `src/lib/admin/*.server.ts` — regras server-side de CRUD, agenda e dashboard.

O painel admin permite gerir:

- serviços
- produtos
- profissionais
- espaços/cadeiras
- galeria
- agendamentos

### Emails e Formulários

O envio real de emails usa Resend através de `src/lib/email/mailer.server.ts`.
Todo formulário operacional deve passar por `sendSiteEmail`, pois ele:

- cria registro em `form_submissions`;
- envia email interno para `EMAIL_TO`;
- usa `replyTo` com o email do cliente quando existir;
- envia confirmação automática ao cliente quando `confirmation.enabled = true`;
- registra erro no payload se o envio falhar.

Variáveis necessárias no Render e no `.env` local:

```env
DATABASE_URL=...
RESEND_API_KEY=...
EMAIL_FROM=LOMA <no-reply@lomaexperience.com>
EMAIL_TO=...
EMAIL_REPLY_TO=...
EMAIL_LOGO_URL=https://midiasave-5c064.web.app/logo-lomaa.png
NODE_ENV=production
```

Formulários atualmente integrados:

- `/api/contact` — contacto;
- `/api/newsletter` — newsletter;
- `/api/cart-request` — lista de produtos do carrinho, sem pagamento;
- `/api/booking` — pedido de agendamento com bloqueio por profissional;
- `/api/professional-inquiry` — candidatura de profissionais.

Regra para próximas alterações: não criar envio direto com `fetch` para terceiros no frontend.
Crie ou ajuste uma rota em `src/routes/api.*.tsx`, valide com `zod`, chame `sendSiteEmail`
e mantenha o payload completo em `form_submissions`.

### Agenda Própria

O agendamento não usa Cal.com. O fluxo atual é próprio:

- serviços e profissionais vêm do PostgreSQL;
- disponibilidade é consultada em `/api/booking/availability`;
- a reserva é criada em `appointments`;
- horários são bloqueados por `professional_id`;
- dois profissionais diferentes podem atender no mesmo horário;
- o admin acompanha tudo em `/admin/agendamentos`;
- o botão de Google Calendar no admin apenas monta um evento manual para a equipa adicionar.

Para preparar o banco, rode `db/add-booking-appointments.sql` no DBeaver conectado ao banco do Render.

### Adicionar FAQ

Criar `src/routes/faq.tsx` e adicionar a chave `faq` em `pt.ts` e `en.ts` com a estrutura de perguntas/respostas.

---

## Informações da Marca

| Campo                | Valor                            |
| -------------------- | -------------------------------- |
| Nome                 | LOMA Clinic & Beauty Hair        |
| Fundadora            | Marina Loreti                    |
| Localização          | Silveira — Torres Vedras         |
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

O DNS do domínio `lomaexperience.com` aponta para o Render via Cloudflare (proxy DNS apenas).

---

## Notas de Desenvolvimento

- O roteador gera `routeTree.gen.ts` automaticamente — **não editar manualmente**.
- O carrinho usa Zustand com persistência (localStorage).
- Os formulários operacionais usam backend TanStack Start + Resend + `form_submissions`.
- O carrinho não tem checkout/pagamento; ao finalizar, envia uma lista de produtos por email.
- A agenda é própria no PostgreSQL, com bloqueio por profissional e sem dependência de Cal.com.
- As imagens devem ser otimizadas antes de colocar em `src/assets/` (recomendado: WebP, máx. 2000px de largura).

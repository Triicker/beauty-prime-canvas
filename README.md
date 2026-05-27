# LOMA Clinic & Beauty Hair — Website

Site oficial da **LOMA Clinic & Beauty Hair**, fundado por Marina Loreti. Espaço premium de transformação capilar e bem-estar localizado em Silveira — Torres Vedras.

---

## Visão Geral do Projeto

Website institucional multi-página com agendamento, loja, galeria e área de profissionais. Construído com tecnologias modernas e deployado no Render (Node.js SSR).

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React + SSR) |
| Roteamento | [TanStack Router](https://tanstack.com/router) — file-based routing |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Componentes UI | [Radix UI](https://www.radix-ui.com/) via shadcn/ui |
| Internacionalização | [react-i18next](https://react.i18next.com/) (PT + EN) |
| Estado global | Zustand (`src/store/cart.ts`) |
| Deploy | [Render](https://render.com/) (Node.js SSR) |
| Bundler | Vite |
| Linguagem | TypeScript |

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

### Adicionar FAQ

Criar `src/routes/faq.tsx` e adicionar a chave `faq` em `pt.ts` e `en.ts` com a estrutura de perguntas/respostas.

---

## Informações da Marca

| Campo | Valor |
|---|---|
| Nome | LOMA Clinic & Beauty Hair |
| Fundadora | Marina Loreti |
| Localização | Silveira — Torres Vedras |
| Email | Lomahairspa@gmail.com |
| Cor primária (ouro) | `#f4d183` |
| Cor de fundo (cacau) | `#7d563d` |
| Cor neutra | `#e6e6e6` |
| Fontes (marketing) | Safira March, Quicksand, Poppins |

---

## Deploy

O site é deployado no **[Render](https://render.com/)** como um serviço Node.js:

| Campo | Valor |
|---|---|
| Build Command | `npm run build` |
| Start Command | `node dist/server/server.js` |
| Node Version | 20+ |

O DNS do domínio `lomaexperience.com` aponta para o Render via Cloudflare (proxy DNS apenas).

---

## Notas de Desenvolvimento

- O roteador gera `routeTree.gen.ts` automaticamente — **não editar manualmente**.
- O carrinho usa Zustand com persistência (localStorage).
- O formulário de agendamento e de contacto são client-side apenas (sem backend real ligado); integração futura pode usar Cloudflare Workers + D1 ou um serviço de email.
- As imagens devem ser otimizadas antes de colocar em `src/assets/` (recomendado: WebP, máx. 2000px de largura).

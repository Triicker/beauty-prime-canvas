## Visão Geral

Website premium estilo editorial/beauty luxury para **Loma Clinic & Beauty Spa**, inspirado na estrutura do imagemdemarca.pt, com identidade visual própria (castanho quente + dourado, baseada no logótipo enviado). Bilingue PT/EN, totalmente visual (sem backend), conteúdo placeholder elegante.

## Identidade Visual

- **Paleta** (extraída do logo):
  - Background castanho quente `oklch(~0.42 0.06 50)` 
  - Dourado claro `oklch(~0.88 0.10 85)`
  - Creme/marfim, preto suave, branco off-white
  - Modo escuro nativo (predominante) + variante clara para loja/galeria
- **Tipografia**: serif display elegante (Cormorant Garamond ou Playfair) para headlines + sans moderna (Inter/Manrope) para corpo. Tracking amplo em uppercase para labels.
- **Logo**: imagem enviada usada tal e qual (sem recriar) no header, footer e selo circular.
- **Motion**: fade/slide suaves, parallax discreto no hero, hover glow dourado nos cards, reveal on scroll.

## Estrutura de Rotas (TanStack Router)

```
/              Home (hero + destaques de cada secção)
/sobre         Sobre o salão
/servicos      Catálogo de serviços
/agendamento   Fluxo multi-passo (mock)
/loja          E-commerce (catálogo + carrinho mock)
/galeria       Masonry antes/depois
/contactos     Mapa, formulário, redes
```

Cada rota com `head()` próprio (title, description, og). Header/footer partilhados via `__root.tsx`.

## Páginas — conteúdo

**Home**
- Hero fullscreen: imagem editorial + overlay escuro + headline serif + 2 CTAs ("Marcar Agendamento", "Conhecer Serviços")
- Faixa "About" curta com selo circular do logo
- Grelha de 6 serviços em destaque
- Faixa de produtos da loja
- Galeria preview (4 imagens)
- Testemunhos carrossel
- Faixa CTA final + footer

**Sobre**: história, missão, diferenciais, equipa (cards), ambiente.

**Serviços**: cards categorizados (Corte, Coloração, Tratamentos, Alisamentos, Estética Capilar, Hidratação) com hover sofisticado, preço placeholder, duração.

**Agendamento (mock, sem BD)**: stepper 4 passos — Serviço → Profissional → Data/Hora → Dados → Ecrã de confirmação elegante. Estado em React local; nenhum dado é enviado.

**Loja (mock)**: grelha de produtos, filtros por categoria, página de produto, carrinho lateral (Zustand ou Context), checkout fake com confirmação visual.

**Galeria**: masonry responsivo com lightbox, separadores antes/depois.

**Contactos**: formulário (apenas UI), mapa estático embed, WhatsApp/Instagram, horário, morada placeholder.

## Bilingue PT/EN

- `react-i18next` com dicionários `pt.json` e `en.json`
- Seletor PT|EN no header
- Default: PT-PT
- Persistência em localStorage

## Imagens

Imagens free de Unsplash (curadoria editorial: cabelos, salão, produtos, retratos) descarregadas para `src/assets/`. Sem stock genérico.

## Componentes-chave

- `Header` (logo + nav + lang switcher + CTA)
- `Footer` (logo, links, redes, newsletter UI)
- `ServiceCard`, `ProductCard`, `TestimonialCard`
- `BookingStepper` + sub-steps
- `CartDrawer`
- `MasonryGallery` + `Lightbox`
- `SectionHeading` (eyebrow + serif title)

## Stack Técnica

- TanStack Start já configurado (manter `__root.tsx`, `routeTree.gen`)
- Tailwind v4 com tokens em `src/styles.css` (oklch)
- shadcn/ui (Button, Dialog, Drawer, Tabs, Calendar, Input, Sheet)
- `react-i18next`, `zustand` (carrinho), `framer-motion` (animações)
- Imagens otimizadas em `src/assets/`

## Fora de Âmbito (esta fase)

- Lovable Cloud / base de dados
- Pagamentos reais (Stripe)
- Integração Shopify
- Envio real de emails/formulários
- Login/área cliente

Tudo acima fica como UI funcional mock; pode ser ativado numa fase seguinte.

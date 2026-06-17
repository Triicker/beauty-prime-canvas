# STATUS DO PROJETO — LOMA Clinic & Beauty Hair

Checklist completo do estado atual do site, com o que está funcional, o que precisa de correção e o que aguarda implementação para o lançamento.

> **Última revisão:** Junho 2026  
> **Branch:** master

---

## Legenda

| Símbolo | Significado                                 |
| ------- | ------------------------------------------- |
| ✅      | Funcional — testado e correto               |
| ⚠️      | Implementado mas com problema / dado errado |
| 🔧      | Correção pequena necessária (rápida)        |
| 🚧      | Visual only — sem backend real              |
| ❌      | Não implementado / em falta                 |
| ⏳      | Aguarda informação da Marina Loreti         |

---

## 1. PÁGINAS & ROTAS

| Página         | Rota             | Estado | Observação                                                                             |
| -------------- | ---------------- | ------ | -------------------------------------------------------------------------------------- |
| Home           | `/`              | ✅     | Hero vídeo, About, Serviços, Produtos, Galeria preview, Testemunhos, CTA               |
| Sobre          | `/sobre`         | ✅     | História, Missão, 4 Valores — conteúdo LOMA aplicado                                   |
| Serviços       | `/servicos`      | ✅     | 6 serviços com imagem, preço, duração, link para agendamento                           |
| Agendamento    | `/agendamento`   | ✅     | Agenda própria no PostgreSQL; bloqueio por profissional; confirmação por email         |
| Loja           | `/loja`          | ✅     | Listagem, filtros e carrinho funcionam; finalizar envia lista por email, sem pagamento |
| Galeria        | `/galeria`       | ✅     | Lightbox, antes/depois slider, filtros por categoria                                   |
| Profissionais  | `/profissionais` | ✅     | Página completa; candidatura profissional enviada por email com confirmação            |
| Contactos      | `/contactos`     | ✅     | Mapa correto; formulário integrado ao Resend com confirmação por email                 |
| FAQ            | `/faq`           | ✅     | Accordion por secções, totalmente estático                                             |
| 404            | `*`              | ✅     | Página não encontrada implementada                                                     |
| Error Boundary | `*`              | ✅     | Página de erro com botão "Tentar de novo" implementada                                 |

---

## 2. COMPONENTES GLOBAIS

### Header

| Funcionalidade                      | Estado | Observação                                  |
| ----------------------------------- | ------ | ------------------------------------------- |
| Logo + nome LOMA                    | ✅     |                                             |
| Navegação desktop (8 links)         | ✅     | Todos os links ativos                       |
| Menu hamburger mobile               | ✅     | Fecha ao navegar                            |
| Scroll-aware (transparente → fosco) | ✅     |                                             |
| Link ativo destacado                | ✅     |                                             |
| Botão de agendamento (desktop)      | ✅     |                                             |
| Ícone do carrinho com badge         | ✅     | Conta itens em tempo real                   |
| Switcher PT/EN/FR                   | ✅     | Cicla PT → EN → FR → PT; persiste na sessão |

### Footer

| Funcionalidade     | Estado | Observação                                                          |
| ------------------ | ------ | ------------------------------------------------------------------- |
| Logo + tagline     | ✅     |                                                                     |
| Links de navegação | ✅     |                                                                     |
| Morada no footer   | ✅     | Dados de `i18n/pt.ts`                                               |
| Telefone no footer | ✅     | `+351 913 016 182`                                                  |
| Email no footer    | ✅     | `Lomahairspa@gmail.com`                                             |
| Newsletter form    | ✅     | Envia inscrição via Resend e registra em `form_submissions`         |
| Instagram link     | ✅     | `https://www.instagram.com/lomahairspa/`                            |
| Facebook link      | ✅     | `https://web.facebook.com/p/Loma-Clinic-Beauty-Spa-61573543078184/` |
| Copyright          | ✅     | "LOMA Clinic & Beauty Hair"                                         |

### CartDrawer

| Funcionalidade             | Estado | Observação                                                                        |
| -------------------------- | ------ | --------------------------------------------------------------------------------- |
| Abrir/fechar com animação  | ✅     |                                                                                   |
| Listar itens com imagem    | ✅     |                                                                                   |
| Ajustar quantidade (+ / −) | ✅     |                                                                                   |
| Remover item               | ✅     |                                                                                   |
| Subtotal calculado         | ✅     |                                                                                   |
| Persistência localStorage  | ✅     | Carrinho sobrevive a refresh                                                      |
| Checkout                   | ✅     | Finalizar compra envia lista de produtos por email — **sem gateway de pagamento** |

---

## 3. INTERAÇÕES DO UTILIZADOR

### Emails / Resend

| Item                   | Estado | Observação                                                  |
| ---------------------- | ------ | ----------------------------------------------------------- |
| Serviço de email       | ✅     | Resend configurado via `RESEND_API_KEY`                     |
| Email interno          | ✅     | Enviado para `EMAIL_TO`                                     |
| Confirmação ao cliente | ✅     | Habilitada por formulário com `confirmation.enabled = true` |
| Registro no banco      | ✅     | Toda submissão operacional entra em `form_submissions`      |
| Logo no email          | ✅     | `EMAIL_LOGO_URL` ou fallback público do midiasave           |
| Retry de email         | ✅     | Tentativas curtas antes de marcar `email_failed`            |
| Rate limit público     | ✅     | PostgreSQL em `public_rate_limits` antes de email/gravação  |
| Limpeza de rate limit  | ✅     | Inicialização + intervalo controlado; sem limpeza aleatória |

Variáveis esperadas no Render: `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `EMAIL_REPLY_TO`, `EMAIL_LOGO_URL`, `RATE_LIMIT_SALT`, `NODE_ENV`.

`RATE_LIMIT_SALT` deve estar definido em produção. O backend não usa `DATABASE_URL` como fallback
para salt.

Regra para próximas alterações: manter envio server-side em rotas `src/routes/api.*.tsx`, validar entrada com `zod`, aplicar `enforceRateLimit` em endpoint público, usar `sendSiteEmail` e guardar o payload completo em `form_submissions`.

### Formulários

| Formulário                                 | Página           | Validação HTML                  | Backend | Estado                                                                     |
| ------------------------------------------ | ---------------- | ------------------------------- | ------- | -------------------------------------------------------------------------- |
| Formulário de contacto                     | `/contactos`     | ✅ (`required`, `type="email"`) | ✅      | Envia para `EMAIL_TO`, confirma cliente e salva em `form_submissions`      |
| Formulário de agendamento (dados pessoais) | `/agendamento`   | ✅ (`required`)                 | ✅      | Cria `appointments`, envia confirmação e bloqueia horário por profissional |
| Formulário de profissionais                | `/profissionais` | ✅ (`required`)                 | ✅      | Candidatura completa enviada via Resend e salva em `form_submissions`      |
| Newsletter (footer)                        | Global           | ✅ (`required`, `type="email"`) | ✅      | Envia inscrição via Resend e salva em `form_submissions`                   |

> **Regra atual:** formulários operacionais devem usar rotas `src/routes/api.*.tsx`, validação com `zod`, `enforceRateLimit` para rotas públicas e `sendSiteEmail` em `src/lib/email/mailer.server.ts`. O helper envia email interno, confirmação ao cliente quando habilitada e registra a submissão em `form_submissions`.

### Admin operacional

| Área                      | Estado | Observação                                                                 |
| ------------------------- | ------ | -------------------------------------------------------------------------- |
| Dashboard inicial         | ✅     | Mostra agendamentos de hoje, próximos, pendentes, mensagens e newsletter   |
| Produtos mais solicitados | ✅     | Calculado a partir dos pedidos de carrinho salvos em `form_submissions`    |
| Filtros de agendamento    | ✅     | Data, profissional, serviço e status                                       |
| Ações rápidas             | ✅     | Confirmar, cancelar, reagendar, copiar contacto, abrir WhatsApp e reenviar |
| Histórico de agenda       | ✅     | `appointment_events` registra criação, status, reagendamento e reenvio     |

### Documentação para Operação

| Documento                           | Estado | Uso                                                                                             |
| ----------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `docs/manual-admin-cliente-loma.md` | ✅     | Manual da cliente para operar produtos, serviços, profissionais, banners, agenda e candidaturas |
| `docs/render-admin-setup.md`        | ✅     | Setup técnico do Render/PostgreSQL/admin                                                        |
| `docs/booking-admin-setup.md`       | ✅     | Setup técnico da agenda própria                                                                 |
| `docs/proximos-passos-loma.md`      | ✅     | Recomendações de segurança, design e próximas funcionalidades                                   |

### Agendamento (wizard de 3 passos)

| Passo                             | Funcionalidade                          | Estado | Observação                                                  |
| --------------------------------- | --------------------------------------- | ------ | ----------------------------------------------------------- |
| Passo 1 — Escolha de Serviço      | Listagem clicável                       | ✅     | Serviços visíveis vêm do PostgreSQL                         |
| Passo 2 — Escolha de Profissional | Listagem clicável                       | ✅     | Profissionais visíveis vêm do PostgreSQL                    |
| Passo 3 — Data/Hora               | Grid de datas + horários disponíveis    | ✅     | Disponibilidade consultada em `/api/booking/availability`   |
| Passo 4 — Dados pessoais          | Campos nome/email/telefone/notas        | ✅     | Validação básica                                            |
| Confirmação visual                | Ecrã de confirmação após submissão      | ✅     |                                                             |
| Notificação real                  | Email de confirmação para cliente/LOMA  | ✅     | Resend via `sendSiteEmail`                                  |
| Disponibilidade real              | Bloqueio por profissional no PostgreSQL | ✅     | Mesmo horário permitido para profissionais diferentes       |
| Fuso horário                      | Europe/Lisbon                           | ✅     | Servidor grava `timestamptz` e exibe em horário de Portugal |
| Proteção contra conflito          | Transação + constraint no PostgreSQL    | ✅     | Evita dupla marcação simultânea para o mesmo profissional   |
| Validações server-side            | Duração, passado e expediente           | ✅     | Impede horário inválido antes de gravar                     |
| Cache de verificações de tabela   | `appointments` / `appointment_events`   | ✅     | Evita `to_regclass` repetido após primeira confirmação      |

### Carrinho (Loja)

| Funcionalidade                            | Estado |
| ----------------------------------------- | ------ |
| Adicionar produto                         | ✅     |
| Remover produto                           | ✅     |
| Alterar quantidade                        | ✅     |
| Limpar carrinho                           | ✅     |
| Abrir drawer automaticamente ao adicionar | ✅     |
| Contagem de itens no header               | ✅     |
| Subtotal                                  | ✅     |
| Envio da lista de produtos por email      | ✅     |
| Checkout real (pagamento)                 | ❌     |

### Galeria

| Funcionalidade                                         | Estado |
| ------------------------------------------------------ | ------ |
| Filtros por categoria (All, Before/After, Salon, Team) | ✅     |
| Lightbox ao clicar na imagem                           | ✅     |
| Slider Antes/Depois (arrastar) — mouse                 | ✅     |
| Slider Antes/Depois (arrastar) — touch mobile          | ✅     |

---

## 4. BUGS / DADOS ERRADOS A CORRIGIR

| Prioridade      | Ficheiro                       | Problema                                                               | Correção                                                 |
| --------------- | ------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| ~~🔴 Alta~~ ✅  | `src/components/Footer.tsx`    | Telefone `+351 210 000 000`                                            | **Corrigido** → `+351 913 016 182`                       |
| ~~🔴 Alta~~ ✅  | `src/components/Footer.tsx`    | Email `hello@loma.pt`                                                  | **Corrigido** → `Lomahairspa@gmail.com`                  |
| ~~🔴 Alta~~ ✅  | `src/components/Footer.tsx`    | Copyright "Loma Clinic & Beauty Spa"                                   | **Corrigido** → "LOMA Clinic & Beauty Hair"              |
| ~~🔴 Alta~~ ✅  | `src/components/Footer.tsx`    | Instagram `href="#"`                                                   | **Corrigido** → URL real                                 |
| ~~🔴 Alta~~ ✅  | `src/components/Footer.tsx`    | Facebook `href="#"`                                                    | **Corrigido** → URL real                                 |
| ~~🟠 Média~~ ✅ | `src/routes/agendamento.tsx`   | Título SEO "Loma Clinic & Beauty Spa"                                  | **Corrigido**                                            |
| ~~🟠 Média~~ ✅ | `src/routes/loja.tsx`          | Título SEO "Boutique — Loma Clinic & Beauty Spa"                       | **Corrigido**                                            |
| ~~🟠 Média~~ ✅ | `src/routes/galeria.tsx`       | Título SEO "Galeria — Loma Clinic & Beauty Spa"                        | **Corrigido**                                            |
| ~~🟠 Média~~ ✅ | `src/routes/profissionais.tsx` | `og:url` e `og:image` apontavam para `beauty-prime-canvas.lovable.app` | **Corrigido** → `lomaexperience.com/profissionais`       |
| ~~🟠 Média~~ ✅ | `src/routes/__root.tsx`        | `og:image` e `twitter:image` apontavam para CDN lovable.app            | **Corrigido** → `https://lomaexperience.com/og-loma.jpg` |
| ~~🟡 Baixa~~ ✅ | `src/routes/contactos.tsx`     | Instagram link genérico `https://instagram.com`                        | **Corrigido** → `https://www.instagram.com/lomahairspa/` |

---

## 5. META TAGS & SEO

| Item                                 | Estado | Observação                                                                                                   |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------ |
| `<title>` único por página           | ✅     | (exceto agendamento, loja, galeria — ver tabela acima)                                                       |
| `description` por página             | ✅     |                                                                                                              |
| `og:title` / `og:description`        | ✅     |                                                                                                              |
| `og:image` real                      | ✅     | `public/og-loma.jpg` criado (`src/assets/logo-loma.jpg` copiado)                                             |
| Favicon (aba do browser)             | ✅     | `public/favicon.jpg` criado (`logo-loma-seal.jpg`); `<link rel="icon">` e `apple-touch-icon` no `__root.tsx` |
| `twitter:card`                       | ✅     | summary_large_image                                                                                          |
| `canonical` global                   | ✅     | No `__root.tsx`                                                                                              |
| `canonical` por página               | ✅     | Adicionado a todas as 9 páginas                                                                              |
| `og:url` por página                  | ✅     | Adicionado a todas as 9 páginas com URL `lomaexperience.com`                                                 |
| `sitemap.xml`                        | ✅     | `public/sitemap.xml` criado com 9 rotas e prioridades corretas                                               |
| `robots.txt`                         | ✅     | `public/robots.txt` criado com `Allow: /` e referência ao sitemap                                            |
| `lang="pt"` na `<html>`              | ✅     |                                                                                                              |
| Schema.org / JSON-LD (negócio local) | ✅     | `LocalBusiness + BeautySalon` em `__root.tsx` — nome, morada, telefone, email, horários, redes sociais       |

---

## 6. INTERNACIONALIZAÇÃO (i18n)

| Língua                      | Ficheiro                    | Estado | Observação                                                   |
| --------------------------- | --------------------------- | ------ | ------------------------------------------------------------ |
| Português (PT)              | `src/i18n/pt.ts`            | ✅     | Fonte de verdade; exporta tipo `Dict`                        |
| Inglês (EN)                 | `src/i18n/en.ts`            | ✅     | Cobertura completa                                           |
| Francês (FR)                | `src/i18n/fr.ts`            | ✅     | Cobertura completa — criado em Junho 2026                    |
| Configuração i18next        | `src/i18n/index.ts`         | ✅     | PT, EN, FR registados; fallback PT; persistência `loma_lang` |
| Switcher de idioma (Header) | `src/components/Header.tsx` | ✅     | Cicla PT → EN → FR → PT; exibe idioma atual                  |

---

## 7. TIPOGRAFIA & DESIGN

| Item                                | Estado | Observação                                                                                                                              |
| ----------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Cormorant Garamond (display)        | ✅     | Carregada via Google Fonts                                                                                                              |
| Poppins (corpo)                     | ✅     | Carregada via Google Fonts                                                                                                              |
| Quicksand                           | ✅     | Carregada via Google Fonts                                                                                                              |
| Safira March                        | ⚠️     | `@font-face` adicionado em `src/styles.css` → `/fonts/SafiraMarch.woff2`; **ficheiros de fonte ainda não colocados em `public/fonts/`** |
| Variáveis CSS (cores, espaçamentos) | ✅     | `src/styles.css`                                                                                                                        |
| Animações Reveal (scroll-triggered) | ✅     | Componente `Reveal.tsx` com IntersectionObserver                                                                                        |
| Responsive (mobile-first)           | ✅     |                                                                                                                                         |
| Dark theme (fundo cacau)            | ✅     |                                                                                                                                         |

---

## 7. PERFORMANCE & DEPLOY

| Item                            | Estado | Observação                                                             |
| ------------------------------- | ------ | ---------------------------------------------------------------------- |
| SSR (TanStack Start)            | ✅     |                                                                        |
| Cloudflare Workers (edge)       | ✅     | `wrangler.jsonc` configurado                                           |
| Pool PostgreSQL                 | ✅     | `max=5`, `idleTimeoutMillis=30000`, `connectionTimeoutMillis=5000`     |
| Health check Render             | ✅     | `/api/health` valida `select 1` no PostgreSQL e responde `200` / `503` |
| Rate limit cleanup              | ✅     | Limpeza na inicialização e depois 1 vez por hora                       |
| Lazy loading de imagens         | ✅     | `loading="lazy"` em todas as imgs                                      |
| CartDrawer lazy loaded          | ✅     | `Suspense` + `lazy()`                                                  |
| Vídeo hero (mobile e desktop)   | ✅     | Dois ficheiros separados                                               |
| Imagens em WebP/JPEG otimizados | ⏳     | A verificar antes do deploy final                                      |
| `npm run build` sem erros       | ⏳     | A verificar                                                            |

---

## 8. LEGAL & CONFORMIDADE (RGPD / EU)

| Item                              | Estado | Observação                                                                                                         |
| --------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| Banner de cookies / consentimento | ✅     | `src/components/CookieBanner.tsx` — armazenamento local, botões aceitar/recusar, link para política de privacidade |
| Política de Privacidade           | ✅     | `/privacidade` — página completa RGPD em português; morada e NIF preenchidos                                       |
| Termos e Condições                | ✅     | `/termos` — página completa com política de agendamento, loja, PI, lei portuguesa; morada e NIF preenchidos        |
| Links legais no Footer            | ✅     | Privacidade · Termos — copyright bar                                                                               |
| Sitemap atualizado                | ✅     | `/privacidade` e `/termos` adicionados ao `public/sitemap.xml`                                                     |

> **NIF preenchido:** `233249168` já está aplicado em `src/routes/privacidade.tsx` e `src/routes/termos.tsx`.

---

## 11. AGUARDA INFORMAÇÃO DA MARINA LORETI ⏳

| Item                                       | Necessário para                                | Prioridade                                          |
| ------------------------------------------ | ---------------------------------------------- | --------------------------------------------------- |
| Morada exata completa                      | Contactos, Footer, RGPD (privacidade e termos) | ✅ R. da Azenha 6, 2560-474 Silveira, Torres Vedras |
| NIF da empresa                             | Política de Privacidade, Termos e Condições    | ✅ 233249168                                        |
| Confirmação de preços dos serviços         | Serviços, Agendamento                          | 🟠 Média                                            |
| Fotos dos produtos reais                   | Loja                                           | 🟡 Baixa                                            |
| ~~Domínio final (para canonical, og:url)~~ | ~~SEO global~~                                 | ✅ Confirmado: `lomaexperience.com`                 |
| Logo em alta resolução (SVG preferível)    | Header, Footer, OG Image                       | 🟠 Média                                            |

---

## 12. BACKLOG — PARA LANÇAMENTO V1 (mínimo)

> Tarefas obrigatórias antes de lançar o site ao público.

- [x] ~~Corrigir telefone e email no Footer~~ ✅
- [x] ~~Corrigir copyright no Footer~~ ✅
- [x] ~~Atualizar Instagram e Facebook links reais~~ ✅
- [x] ~~Corrigir títulos SEO de agendamento, loja, galeria~~ ✅
- [x] ~~Adicionar tradução francesa (FR)~~ ✅
- [x] ~~Remover todas as referências `lovable.app` do código~~ ✅
- [x] ~~Adicionar `canonical` e `og:url` a todas as páginas~~ ✅
- [x] ~~Criar `sitemap.xml`~~ ✅
- [x] ~~Criar `robots.txt`~~ ✅
- [x] ~~Implementar Schema.org JSON-LD (LocalBusiness/BeautySalon)~~ ✅
- [x] ~~Adicionar `@font-face` para Safira March~~ ✅
- [ ] Criar imagem OG real (`public/og-loma.jpg`, 1200×630 px) e colocar em `/public/`
- [ ] Colocar ficheiros de fonte em `public/fonts/SafiraMarch.woff2` (e `.woff`)
- [x] ~~Integrar formulário de contacto com envio real via Resend~~ ✅
- [x] ~~Integrar formulário de agendamento com notificação por email~~ ✅
- [x] ~~Integrar formulário de profissionais com notificação por email~~ ✅
- [x] ~~Banner de consentimento de cookies (RGPD)~~ ✅
- [x] ~~Página de Política de Privacidade~~ ✅
- [x] ~~Página de Termos e Condições~~ ✅
- [x] ~~Preencher morada completa nas páginas /privacidade e /termos~~ ✅ R. da Azenha 6, 2560-474 Silveira
- [x] Preencher NIF nas páginas /privacidade e /termos

---

## 11. BACKLOG — PARA VERSÃO FUTURA V2

> Funcionalidades que enriquecem o site mas não bloqueiam o lançamento.

- [ ] Checkout real com pagamento (Stripe / MB Way)
- [x] ~~Sistema de agendamento com disponibilidade real via agenda própria no PostgreSQL~~ ✅
- [ ] Newsletter com lista de emails real (Mailchimp / Brevo)
- [ ] WhatsApp floating button em todas as páginas
- [ ] Analytics (ex: Cloudflare Analytics, Plausible)
- [ ] Otimização de imagens para WebP
- [ ] Open Graph image dedicada (1200×630px com branding LOMA)

---

## RESUMO EXECUTIVO

| Área                                           | Estado Geral                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| UI / Visual                                    | ✅ Completo                                                              |
| Navegação e rotas                              | ✅ Completo                                                              |
| Conteúdo / i18n                                | ✅ 99% (morada real e NIF preenchidos; revisão comercial final pendente) |
| Interações UI (formulários, carrinho, galeria) | ✅ Funcionais no frontend                                                |
| Backend / integrações reais                    | ✅ PostgreSQL Render, admin CRUD, agenda própria e emails Resend         |
| SEO básico                                     | ⚠️ Bom mas com inconsistências a corrigir                                |
| SEO avançado (sitemap, schema)                 | ✅ Sitemap 11 rotas, robots.txt, JSON-LD                                 |
| Legal (RGPD)                                   | ✅ Banner + Privacidade + Termos implementados; morada e NIF preenchidos |
| Deploy                                         | ✅ Configuração Cloudflare Workers pronta                                |

> **Estimativa:** O site está ~92% pronto para lançamento. As integrações principais de formulários, email, admin, produtos e agenda já existem; os pontos pendentes maiores são revisão final de conteúdo, otimização de imagens e eventuais integrações futuras como pagamento/lista real de newsletter.

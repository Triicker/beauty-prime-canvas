# Plano de Alterações — LOMA Clinic & Beauty Hair

Documento de referência para aplicar as informações reais da marca no site.  
Cada item indica **o que está atualmente**, **o que deve ficar** e **onde fazer a alteração**.

### Legenda de estado
- ✅ **Concluído** — já aplicado no código
- 🔜 **Próxima leva** — pronto para implementar
- ⏳ **Aguarda info** — depende de dados da LOMA

---

## 1. ✅ Nome da Marca — "Beauty Spa" → "Beauty Hair"

O nome atual em todo o código é **"Loma Clinic & Beauty Spa"**. Deve passar a **"LOMA Clinic & Beauty Hair"**.

| Ficheiro | Local exato | Atual | Deve ser |
|---|---|---|---|
| `src/i18n/pt.ts` | `home.eyebrow` | `"Loma Clinic & Beauty Spa"` | `"LOMA Clinic & Beauty Hair"` |
| `src/i18n/en.ts` | `home.eyebrow` | `"Loma Clinic & Beauty Spa"` | `"LOMA Clinic & Beauty Hair"` |
| `src/i18n/pt.ts` | `footer.tagline` | `"Clinic & Beauty Spa"` | `"Clinic & Beauty Hair"` |
| `src/i18n/en.ts` | `footer.tagline` | `"Clinic & Beauty Spa"` | `"Clinic & Beauty Hair"` |
| `src/routes/index.tsx` | `<title>` (meta head) | `"Loma Clinic & Beauty Spa — Beleza premium em Lisboa"` | `"LOMA Clinic & Beauty Hair — Santa Cruz, Torres Vedras"` |
| `src/routes/index.tsx` | `og:title` | `"Loma Clinic & Beauty Spa"` | `"LOMA Clinic & Beauty Hair"` |
| `src/routes/sobre.tsx` | `<title>` | `"Sobre — Loma Clinic & Beauty Spa"` | `"Sobre — LOMA Clinic & Beauty Hair"` |
| `src/routes/servicos.tsx` | `<title>` | `"Serviços — Loma Clinic & Beauty Spa"` | `"Serviços — LOMA Clinic & Beauty Hair"` |
| `src/routes/contactos.tsx` | `<title>` | `"Contactos — Loma Clinic & Beauty Spa"` | `"Contactos — LOMA Clinic & Beauty Hair"` |

---

## 2. ✅ Localização — Lisboa → Santa Cruz, Torres Vedras

| Ficheiro | Local exato | Atual | Deve ser |
|---|---|---|---|
| `src/i18n/pt.ts` | `contact.address` | `"Av. da Liberdade, 123 — Lisboa"` | Morada real em Santa Cruz — Torres Vedras |
| `src/i18n/en.ts` | `contact.address` | mesmo | mesmo |
| `src/routes/contactos.tsx` | iframe `src` do mapa | Coordenadas de Lisboa | Coordenadas de Santa Cruz — Torres Vedras |
| `src/routes/index.tsx` | `home.aboutBody` (via i18n) | `"No coração da cidade…"` | Texto actualizado (ver secção 4) |

> **Ação adicional:** actualizar as coordenadas do mapa OpenStreetMap em `contactos.tsx`.  
> Coordenadas aproximadas de Santa Cruz, Torres Vedras: lat 39.1236, lon -9.3889  
> URL sugerido: `https://www.openstreetmap.org/export/embed.html?bbox=-9.4050,39.1100,-9.3750,39.1400&layer=mapnik`

---

## 3. ✅ Email e Telefone — Contactos

| Ficheiro | Local exato | Anterior | Aplicado |
|---|---|---|---|
| `src/routes/contactos.tsx` | Email | `hello@loma.pt` | ✅ `Lomahairspa@gmail.com` |
| `src/routes/contactos.tsx` | Telefone | `+351 210 000 000` | ✅ `+351 913 016 182` *(confirmar número real)* |
| `src/routes/contactos.tsx` | Link WhatsApp | `wa.me/351210000000` | ✅ `wa.me/351913016182` |
| `src/routes/contactos.tsx` | Mapa iframe | Coordenadas Lisboa | ✅ Coordenadas Santa Cruz, Torres Vedras |

---

## 4. ✅ Página Sobre — História e Fundadora Marina Loreti

### 4a. Texto principal (`about.body`)

**Ficheiro:** `src/i18n/pt.ts` → chave `about.body`

**Atual:**
> "A Loma nasceu da convicção de que a verdadeira sofisticação está no detalhe. Reunimos uma equipa multidisciplinar de hairstylists, coloristas e terapeutas capilares para criar uma experiência integral, num ambiente que respira calma e luxo discreto."

**Deve ser:**
> "A LOMA Clinic & Beauty Hair nasceu do desejo de transformar o conceito tradicional de salão de beleza numa experiência completa de bem-estar, autoestima e cuidado personalizado. Fundada por Marina Loreti, especialista em beleza capilar e terapeuta capilar, a LOMA foi criada com uma visão clara: oferecer muito mais do que serviços de cabelo — um espaço onde cada cliente se sente acolhida, valorizada e cuidada de forma única."

### 4b. Título da página Sobre (`about.title`)

**Actual:** `"Onde a tradição da beleza se encontra com a precisão moderna"`  
**Deve ser:** `"Um espaço premium de transformação capilar e autocuidado"`

### 4c. Missão (`about.missionBody`)

**Actual:** `"Elevar o ritual de cuidado capilar a uma forma de expressão pessoal — com técnica, sensibilidade e produtos de excelência."`  
**Deve ser:** `"Oferecer uma experiência completa de beleza, saúde capilar e bem-estar — onde cada cliente é cuidada de forma única, com técnica avançada e um ambiente acolhedor que respira sofisticação."`

### 4d. Valores (`about.values`)

Actualizar os 4 valores para refletir o conceito real da marca:

| # | Título (atual) | Corpo (atual) | Título novo | Corpo novo |
|---|---|---|---|---|
| 1 | Técnica de autor | Cortes desenhados… | **Saúde Capilar** | Diagnóstico personalizado e tratamentos focados no bem-estar do couro cabeludo e dos fios. |
| 2 | Coloração responsável | Pigmentos premium… | **Experiência Sensorial** | Cada visita é um ritual — aromaterapia, massagem e cuidados pensados para os sentidos. |
| 3 | Ambiente sereno | Suites privadas… | **Atendimento Humanizado** | Cada cliente é única. Escutamos, avaliamos e personalizamos cada serviço ao seu estilo de vida. |
| 4 | Resultado duradouro | Tratamentos com efeito… | **Luxo Acolhedor** | Sofisticação sem distância. Um ambiente premium que convida à desaceleração e ao autocuidado. |

---

## 5. ✅ Hero e Textos de Apresentação (Home)

> `home.aboutTitle` e `home.aboutBody` já actualizados com localização e conceito real da marca.

~~5a. home.aboutTitle — actualizado~~ ✅  
~~5b. home.aboutBody — actualizado~~ ✅  
~~5c. home.eyebrow — actualizado~~ ✅

---

## 6. ✅ Serviços — Actualização e Reorganização

Os serviços actuais são genéricos. A LOMA foca-se em:  
**Loiros · Coloração · Extensões · Terapia Capilar · Head Spa · Corte**

### Proposta de nova lista (`services.list` em `pt.ts`):

| # | Nome atual | Nome novo | Descrição nova | Preço sugerido | Tempo sugerido |
|---|---|---|---|---|---|
| 1 | Corte Assinatura | **Corte Assinatura** | Análise facial, lavagem ritual, corte personalizado e finalização. | desde 35€ | 60 min |
| 2 | Coloração & Balayage | **Loiros & Coloração** | Especialistas em loiros personalizados — naturais, sofisticados e saudáveis. Balayage, mechas e correção de cor. | desde 95€ | 120–480 min |
| 3 | Tratamentos Capilares | **Terapia Capilar** | Diagnóstico capilar, tratamento de queda, oleosidade, sensibilidade e enfraquecimento dos fios. | desde 60€ | 75 min |
| 4 | Alisamentos Premium | **Extensões Capilares** | Técnica exclusiva e imperceptível. Extensões aplicadas para naturalidade, volume e comprimento. | Consultar | 180 min |
| 5 | Estética Capilar | **Head Spa** | Ritual de relaxamento — massagem, limpeza profunda e cuidados sensoriais para couro cabeludo e cabelo. | desde 70€ | 90 min |
| 6 | Hidratação Profunda | **Hidratação Profunda** | Ritual de hidratação em três tempos com óleos preciosos e ativos botânicos. | desde 55€ | 60 min |

> **Nota:** Os preços e tempos devem ser confirmados pela Marina Loreti antes de publicar.

---

## 7. ✅ Profissionais — Agendamento

**Ficheiro:** `src/i18n/pt.ts` → `booking.professionals`

**Atual:** `["Sofia Almeida", "Inês Carvalho", "Mariana Pinto", "Equipa Loma"]`  
**Deve ser:** `["Marina Loreti", "Equipa LOMA"]` *(ajustar com os nomes reais da equipa)*

---

## 8. ✅ Tipografia — Fontes de Marketing

**Fontes solicitadas:** Safira March · Quicksand · Poppins  
**Fontes actuais:** Cormorant Garamond (display) · Inter (sans)

### Como alterar:

**Ficheiro:** `src/styles.css` → secção `@theme inline`

```css
/* Antes */
--font-display: "Cormorant Garamond", "Playfair Display", ui-serif, Georgia, serif;
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

/* Depois (proposta) */
--font-display: "Cormorant Garamond", ui-serif, Georgia, serif; /* manter para títulos editoriais */
--font-sans: "Poppins", "Quicksand", ui-sans-serif, system-ui, sans-serif;
```

> **Safira March** é uma fonte decorativa/script — ideal para o logótipo ou elementos de destaque (ex: o "LOMA" em display grande). Deve ser carregada como `@font-face` local se não estiver disponível no Google Fonts.  
> **Quicksand e Poppins** estão disponíveis no Google Fonts.

**Ficheiro:** `src/routes/__root.tsx` ou `index.html` (se existir) — adicionar `<link>` para Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet" />
```

---

## 9. ✅ Cores — Verificar Alinhamento com a Paleta Real

**Cores fornecidas pela LOMA:**
- `#7d563d` — castanho quente (fundo / cocoa)
- `#f4d183` — dourado suave (primário / gold)
- `#e6e6e6` — cinza neutro (superfícies claras / cream)

**Verificar em `src/styles.css` (dentro de `:root`):**

| Variável CSS | Cor actual (aproximada) | Cor LOMA | Ação |
|---|---|---|---|
| `--background` | `#1c1008` (dark cocoa) | `#7d563d` | Verificar se é o fundo escuro ou médio |
| `--primary` / `--gold` | `#d4af5a` (aprox.) | `#f4d183` | Ajustar para `#f4d183` |
| `--cream` | `#f5f0e8` (aprox.) | `#e6e6e6` | Ajustar para `#e6e6e6` |
| `--cocoa` | variação do brown | `#7d563d` | Confirmar e ajustar |

> Abrir `src/styles.css` e procurar `:root {` para ver os valores hexadecimais exactos e comparar.

---

## 10. ✅ Nova Página: FAQ

Criar página de perguntas frequentes com base no conteúdo fornecido.

**Ficheiro a criar:** `src/routes/faq.tsx`  
**Tradução a adicionar:** chave `faq` em `src/i18n/pt.ts` e `en.ts`  
**Navegação:** adicionar link "FAQ" em `src/components/Header.tsx` e `src/i18n/pt.ts` (`nav.faq`)

### Estrutura do FAQ (baseada no conteúdo fornecido):

```
Secção: Sobre o Salão
  - O que torna a LOMA diferente?
  - A LOMA trabalha apenas com cabelo?
  - Onde fica a LOMA?

Secção: Agendamentos
  - Como posso fazer marcação?
  - É necessário marcar com antecedência?
  - Posso cancelar ou alterar a marcação?
  - A LOMA aceita clientes sem marcação?

Secção: Loiros e Coloração
  - A LOMA é especializada em loiros?
  - É possível clarear sem danificar?
  - Quanto tempo demora um serviço de loiros?
  - Fazem correção de cor?

Secção: Terapia Capilar
  - O que é terapia capilar?
  - Como sei se preciso de terapia capilar?
  - Quantas sessões são necessárias?

Secção: Extensões Capilares
  - As extensões danificam o cabelo?
  - As extensões ficam visíveis?
  - Quanto tempo duram?

Secção: Head Spa & Wellness
  - O que é o Head Spa?
  - O Head Spa é apenas relaxamento?
  - Posso oferecer um serviço como presente?

Secção: Produtos & Cuidados
  - A LOMA vende produtos profissionais?
  - Recebo orientação de cuidados em casa?

Secção: Atendimento
  - A primeira avaliação está incluída?
  - A LOMA atende apenas mulheres?
  - Posso levar acompanhantes?
```

> **Implementação sugerida:** usar o componente `Accordion` já disponível em `src/components/ui/accordion.tsx` — é o componente ideal para FAQ.

---

## 11. ✅ Referência a "Lisboa" no Código

> Todas as referências a Lisboa removidas nos ficheiros de i18n e meta tags.

Pesquisar e substituir todas as referências a "Lisboa" ou "Lisboa" no código:

```
Ficheiros a verificar:
- src/i18n/pt.ts → contact.address
- src/i18n/en.ts → contact.address
- src/routes/index.tsx → meta title
- src/routes/profissionais.tsx → og:url (tem URL hardcoded)
```

---

## 12. ⏳ URLs Hardcoded — Profissionais

**Ficheiro:** `src/routes/profissionais.tsx`

**Actual (hardcoded):**
```tsx
{ property: "og:image", content: "https://beauty-prime-canvas.lovable.app/og/pros.jpg" },
{ property: "og:url", content: "https://beauty-prime-canvas.lovable.app/profissionais" },
{ rel: "canonical", href: "https://beauty-prime-canvas.lovable.app/profissionais" },
```

**Deve ser:** URL do domínio real da LOMA (a confirmar).

---

## Resumo de Prioridades

| Prioridade | Item | Estado |
|---|---|---|
| 🔴 Alta | Nome da marca (Beauty Spa → Beauty Hair) | ✅ Concluído |
| 🔴 Alta | Localização (Lisboa → Santa Cruz, Torres Vedras) | ✅ Concluído |
| 🔴 Alta | Email, Telefone e Mapa | ✅ Concluído |
| 🟡 Média | Texto sobre/história (Marina Loreti) | 🔜 Próxima leva |
| 🟡 Média | Serviços actualizados (loiros, extensões, head spa) | 🔜 Próxima leva |
| 🟡 Média | Valores da marca (4 cards) | 🔜 Próxima leva |
| 🟡 Média | Profissionais de agendamento | 🔜 Próxima leva |
| 🟡 Média | Criar página FAQ | 🔜 Próxima leva |
| 🟢 Baixa | Tipografia (Poppins/Quicksand/Safira March) | 🔜 Próxima leva |
| 🟢 Baixa | Verificar/ajustar cores hex | 🔜 Próxima leva |
| 🟢 Baixa | URLs hardcoded (`profissionais.tsx`) | ⏳ Aguarda domínio real |

---

## 🚀 Próximos Passos — Segunda Leva

### 🟡 Prioridade Média (implementar a seguir)

**1. Página Sobre — História da Marina Loreti** (`pt.ts` + `en.ts`)
- Actualizar `about.title`, `about.body`, `about.missionBody` e `about.values` (ver item 4 acima para textos exactos)

**2. Serviços — Actualizar lista para o catálogo real da LOMA** (`pt.ts` + `en.ts`)
- Substituir serviços genéricos por: Loiros & Coloração, Terapia Capilar, Extensões, Head Spa, Corte Assinatura, Hidratação Profunda
- ⚠️ Confirmar preços e tempos com Marina Loreti antes de publicar

**3. Profissionais — Agendamento** (`pt.ts` + `en.ts`)
- `booking.professionals`: `["Sofia Almeida", "Inês Carvalho", "Mariana Pinto", "Equipa Loma"]` → `["Marina Loreti", "Equipa LOMA"]`

**4. Valores da marca** (`pt.ts` + `en.ts`)
- Actualizar os 4 cards em `about.values` com os textos da LOMA (ver tabela no item 4d)

**5. FAQ** (novo ficheiro `src/routes/faq.tsx` + chave `faq` em i18n)
- Usar o componente `Accordion` já disponível em `src/components/ui/accordion.tsx`

### 🟢 Prioridade Baixa (última leva)

- **Fontes:** Adicionar Poppins/Quicksand via Google Fonts e actualizar `--font-sans` em `styles.css`
- **Cores:** Confirmar se `#f4d183` e `#e6e6e6` estão correctos em `styles.css`
- **Domínio real:** Assim que definido, actualizar `og:url` e `canonical` em `profissionais.tsx`

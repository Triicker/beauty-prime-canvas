# Proximos passos recomendados - LOMA

Este documento resume melhorias recomendadas para evoluir o site com seguranca, consistencia visual e menos retrabalho.

## Seguranca e operacao

- Manter `DATABASE_URL`, `RESEND_API_KEY`, segredos de sessao e credenciais do Google/integrações apenas no Render, nunca no Git.
- Definir rotacao periodica de senha do admin e remover usuarios antigos da tabela `admin_users`.
- Criar backup recorrente do PostgreSQL do Render antes de rodar scripts grandes de catalogo, produtos ou agenda.
- Evitar editar dados diretamente no banco quando ja existir CRUD no admin; usar SQL apenas para migracoes ou cargas em massa.
- Ativar monitoramento de erros do Render e revisar logs apos cada deploy.
- Validar dominio final (`lomaexperience.com`) depois de alteracoes de DNS com `curl -I`, procurando resposta do Render.
- Manter `db/add-public-rate-limits.sql` e `db/add-booking-appointments.sql` aplicados no banco do Render antes de publicar funcionalidades novas de formulario ou agenda.

## Design e conteudo

- Usar o modo light como referencia principal e revisar cada nova secao nos dois temas.
- Manter fotos de produtos em fundo limpo, com proporcao parecida, para a loja e a home ficarem consistentes.
- Marcar produtos em destaque no admin para controlar a vitrine da home; se nenhum destaque existir, a home faz rotacao diaria de produtos visiveis.
- Evitar produtos duplicados no filtro "Todos" se a experiencia ficar confusa; produtos podem ter multiplas categorias na coluna `categories`.
- Criar uma curadoria de 6 a 8 depoimentos reais e exibir apenas os melhores na home.
- Manter banners de marketing com texto legivel mesmo sem overlay pesado.

## Funcionalidades

- Implementar CRUD de testemunhos com importacao/curadoria de avaliacoes do Google Business Profile.
- Evoluir a agenda para disponibilidade configuravel por profissional, com folgas, bloqueios manuais e horarios especiais.
- Adicionar exportacao CSV para pedidos do carrinho, candidaturas profissionais e agendamentos.
- Criar auditoria mais ampla para produtos, servicos e banners, semelhante ao historico de agendamentos.
- Criar campos de SEO por pagina no admin, se o cliente precisar alterar titulos e descricoes sem codigo.
- Adicionar uma area simples de "destaques da home" para escolher manualmente produtos, servicos, banners e depoimentos.

## Loja

- A loja deve continuar usando produtos reais do PostgreSQL.
- Produtos que aparecem em mais de uma categoria devem usar `categories`, nao duplicacao manual, sempre que possivel.
- O carrinho permanece como lista de interesse enviada por email, sem checkout/pagamento.
- Revisar periodicamente precos e disponibilidade com o catalogo oficial Avani.

## Deploy

- Antes de publicar: rodar `npm run build`.
- Depois do deploy: testar home, loja, carrinho, formulario de contacto, candidatura profissional, agendamento e admin.
- Quando houver script SQL novo, rodar primeiro no DBeaver no banco correto do Render e conferir amostras com `select`.

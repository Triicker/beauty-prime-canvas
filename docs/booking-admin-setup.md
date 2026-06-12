# Agenda propria LOMA + PostgreSQL

Este roteiro substitui o Cal.com por uma agenda propria do site, usando o PostgreSQL do Render.

## Como funciona

- O cliente acessa `/agendamento`.
- O site carrega os servicos e profissionais visiveis do banco.
- O cliente escolhe servico, profissional, data e horario.
- O backend salva a marcacao na tabela `appointments`.
- O admin ve as marcacoes em `/admin/agendamentos`.
- O admin pode alterar o status interno e abrir um link para adicionar o evento ao Google Calendar.

## Regra de disponibilidade

A disponibilidade e bloqueada por profissional.

Exemplo:

- Se Ana tem Corte as 10:00, Ana fica bloqueada nesse intervalo.
- Se Maria estiver livre as 10:00, outro cliente ainda pode marcar com Maria.
- O tempo bloqueado vem do campo `duration_label` do servico.

## Banco

No DBeaver, conectado ao banco `loma_site` do Render, rode:

```sql
db/add-booking-appointments.sql
```

Esse script cria ou atualiza a tabela `appointments` com:

- `service_id`
- `professional_id`
- `starts_at`
- `ends_at`
- `duration_minutes`
- dados do cliente
- status interno
- payload original

## Variaveis no Render

Nao precisa mais de:

```env
VITE_CAL_LINK
CAL_WEBHOOK_SECRET
```

Mantenha as variaveis ja usadas pelo projeto:

```env
DATABASE_URL=...
EMAIL_TO=...
EMAIL_FROM=...
EMAIL_REPLY_TO=...
RESEND_API_KEY=...
NODE_ENV=production
```

## Teste local

1. Rode o script `db/add-booking-appointments.sql` no banco do Render.
2. Inicie o projeto:

```bash
npm run dev
```

3. Acesse `/agendamento`.
4. Escolha servico, profissional, data e horario.
5. Envie o pedido.
6. Confira no DBeaver a tabela `appointments`.
7. Acesse `/admin/agendamentos` e valide se a marcacao apareceu.

## Proximo refinamento recomendado

Hoje a grade de horarios e fixa no codigo. Depois, podemos criar tabelas de disponibilidade:

- horarios de funcionamento por dia da semana
- folgas por profissional
- bloqueios manuais
- capacidade por servico ou cadeira

Para o primeiro teste, a grade fixa e suficiente e mais simples de validar.

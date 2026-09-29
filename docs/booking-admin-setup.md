# Agenda propria LOMA + PostgreSQL

Este roteiro substitui o Cal.com por uma agenda propria do site, usando o PostgreSQL do Render.

## Como funciona

- O cliente acessa `/agendamento`.
- O site carrega os servicos e profissionais visiveis do banco.
- O cliente escolhe servico, profissional, data e horario.
- O backend salva a marcacao na tabela `appointments`.
- O admin ve as marcacoes em `/admin/agendamentos`.
- O admin pode filtrar, confirmar, cancelar, reagendar, copiar contacto, abrir WhatsApp,
  reenviar email de confirmacao e abrir um link para adicionar o evento ao Google Calendar.
- Cada acao importante fica registrada em `appointment_events`.

## Regra de disponibilidade

A disponibilidade e bloqueada por profissional.

Exemplo:

- Se Ana tem Corte as 10:00, Ana fica bloqueada nesse intervalo.
- Se Maria estiver livre as 10:00, outro cliente ainda pode marcar com Maria.
- O tempo bloqueado vem do campo `duration_label` do servico.
- O servidor valida sempre a duracao real do servico no banco.
- O expediente publico padrao fica centralizado no codigo da agenda: segunda a sabado,
  das 09:00 as 19:00, com domingo fechado.
- A grade de horarios e recalculada conforme a duracao do servico selecionado.
- Um horario so e aceito quando `inicio + duracao <= fechamento`.
- Exemplo: em um servico de 4 horas, 15:00 e valido porque termina as 19:00,
  mas 15:30 e 18:00 sao bloqueados.
- Conflitos sao validados pelo intervalo completo `[inicio, fim)`, nao apenas pelo horario inicial.
- A marcacao e gravada com timezone `Europe/Lisbon`.
- Horarios passados, dias fechados e horarios fora do expediente sao recusados.
- A criacao usa transacao no PostgreSQL e trava por profissional para evitar duas reservas
  simultaneas no mesmo horario.
- A constraint `appointments_no_professional_overlap` reforca essa regra no proprio banco.

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

Tambem cria:

- `appointment_events` para historico de alteracoes;
- constraints de status, duracao, timezone e ordem de horario;
- extensao `btree_gist`, necessaria para bloquear sobreposicao de horarios;
- constraint de sobreposicao por `professional_id`.

Se a constraint de sobreposicao falhar ao rodar o SQL, existem registros conflitantes no banco.
Nesse caso, corrija ou cancele os agendamentos duplicados para o mesmo profissional/horario e rode
o script novamente.

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
8. Teste confirmar, cancelar, reagendar e reenviar email.
9. Confira o historico na tabela `appointment_events` ou na propria tela admin.

## Testes da regra de horarios

O projeto possui testes unitarios para a regra pura de disponibilidade:

```bash
npm test
```

Esses testes cobrem servicos que terminam exatamente no fechamento, horarios que ultrapassam o
fechamento, dia fechado, duracao maior que o expediente e sobreposicao de intervalos.

## Proximo refinamento recomendado

Hoje o expediente semanal ainda e configurado no codigo da agenda. Depois, podemos criar tabelas de disponibilidade:

- horarios de funcionamento por dia da semana
- folgas por profissional
- bloqueios manuais
- capacidade por servico ou cadeira

Para o primeiro teste, a regra centralizada no backend e suficiente e mais simples de validar.

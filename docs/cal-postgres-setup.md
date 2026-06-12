# Integração Cal.com + PostgreSQL

Este projeto usa o Cal.com como agenda principal e o PostgreSQL do Render como cópia operacional para o painel admin.

## 1. Banco de dados

No DBeaver, conectado ao banco do Render, rode:

```sql
db/add-cal-appointments.sql
```

Isso cria a tabela `appointments`, usada para listar marcações em `/admin/agendamentos`.

## 2. Variáveis no Render

No Web Service do Render, adicione:

```env
VITE_CAL_LINK=https://cal.com/seu-usuario/seu-evento
CAL_WEBHOOK_SECRET=um-segredo-grande-e-aleatorio
```

Também pode usar apenas o slug no `VITE_CAL_LINK`, por exemplo:

```env
VITE_CAL_LINK=seu-usuario/seu-evento
```

Depois das variáveis, faça redeploy.

## 3. Variáveis locais

No `.env` local, adicione os mesmos valores para testar:

```env
VITE_CAL_LINK=https://cal.com/seu-usuario/seu-evento
CAL_WEBHOOK_SECRET=um-segredo-grande-e-aleatorio
```

## 4. Webhook no Cal.com

No painel do Cal.com, crie um webhook apontando para:

```txt
https://lomaexperience.com/api/cal/webhook?secret=CAL_WEBHOOK_SECRET
```

Substitua `CAL_WEBHOOK_SECRET` pelo valor real configurado no Render.

Enquanto o domínio estiver propagando, pode usar:

```txt
https://beauty-prime-canvas.onrender.com/api/cal/webhook?secret=CAL_WEBHOOK_SECRET
```

Eventos recomendados:

- Booking Created
- Booking Rescheduled
- Booking Cancelled

## 5. Teste

1. Acesse `/agendamento`.
2. Escolha um horário real no embed do Cal.com.
3. Confirme a marcação.
4. Acesse `/admin/agendamentos`.
5. Verifique se a marcação apareceu no painel.

## 6. Modelo de operação

- Cal.com controla disponibilidade, conflitos, fuso horário e confirmação da agenda.
- PostgreSQL guarda uma cópia para o admin do site.
- O status interno no admin não altera o Cal.com; ele serve para acompanhamento da equipa LOMA.
- Para alterar/cancelar a agenda real, use o painel do Cal.com.

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { sendSiteEmail } from "@/lib/email/mailer.server";

const bookingSchema = z.object({
  service: z.string().trim().min(1),
  pro: z.string().trim().min(1),
  date: z.string().trim().min(1),
  time: z.string().trim().min(1),
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
});

export const Route = createFileRoute("/api/booking")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = bookingSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const result = await sendSiteEmail({
          type: "booking",
          subject: `Novo pedido de agendamento - ${parsed.data.service}`,
          title: "Novo pedido de agendamento",
          intro: "O pedido ainda precisa ser confirmado pela equipa LOMA.",
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          fields: [
            { label: "Serviço", value: parsed.data.service },
            { label: "Profissional", value: parsed.data.pro },
            { label: "Data", value: parsed.data.date },
            { label: "Hora", value: parsed.data.time },
            { label: "Nome", value: parsed.data.name },
            { label: "Email", value: parsed.data.email },
            { label: "Telefone", value: parsed.data.phone },
            { label: "Notas", value: parsed.data.notes },
          ],
          payload: parsed.data,
          confirmation: {
            enabled: true,
            subject: "Recebemos o seu pedido de agendamento - LOMA",
            title: "Pedido de agendamento recebido",
            intro:
              "Obrigada pelo pedido. Esta mensagem confirma apenas a receção; a equipa LOMA entrará em contacto para confirmar a disponibilidade.",
          },
        });

        return Response.json({ ok: true, ...result });
      },
    },
  },
});

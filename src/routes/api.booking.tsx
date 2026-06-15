import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { createAppointmentFromBooking } from "@/lib/admin/appointments.server";
import { sendSiteEmail } from "@/lib/email/mailer.server";
import { enforceRateLimit, publicFormRateLimits } from "@/lib/security/rate-limit.server";

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  professionalId: z.string().uuid(),
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

        const rateLimited = await enforceRateLimit(request, publicFormRateLimits.booking);
        if (rateLimited) return rateLimited;

        let appointment;

        try {
          appointment = await createAppointmentFromBooking(parsed.data);
        } catch (error) {
          return Response.json(
            { message: error instanceof Error ? error.message : "Horário indisponível." },
            { status: 409 },
          );
        }

        const result = await sendSiteEmail({
          type: "booking",
          subject: `Novo pedido de agendamento - ${appointment.service}`,
          title: "Novo pedido de agendamento",
          intro: "O pedido ainda precisa ser confirmado pela equipa LOMA.",
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          fields: [
            { label: "Serviço", value: appointment.service },
            { label: "Profissional", value: appointment.professional },
            { label: "Data", value: parsed.data.date },
            { label: "Hora", value: parsed.data.time },
            { label: "Duração", value: `${appointment.durationMinutes ?? 0} min` },
            { label: "Nome", value: parsed.data.name },
            { label: "Email", value: parsed.data.email },
            { label: "Telefone", value: parsed.data.phone },
            { label: "Notas", value: parsed.data.notes },
          ],
          payload: {
            ...parsed.data,
            appointmentId: appointment.id,
            service: appointment.service,
            professional: appointment.professional,
          },
          confirmation: {
            enabled: true,
            subject: "Recebemos o seu pedido de agendamento - LOMA",
            title: "Pedido de agendamento recebido",
            intro:
              "Obrigada pelo pedido. Esta mensagem confirma apenas a receção; a equipa LOMA entrará em contacto para confirmar a disponibilidade.",
          },
        });

        return Response.json({ ok: true, appointment, ...result });
      },
    },
  },
});

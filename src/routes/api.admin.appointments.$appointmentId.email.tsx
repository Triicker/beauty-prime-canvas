import { createFileRoute } from "@tanstack/react-router";

import { getAdminAppointment, markAppointmentEmailResent } from "@/lib/admin/appointments.server";
import { requireAdmin } from "@/lib/admin/session.server";
import { sendSiteEmail } from "@/lib/email/mailer.server";

export const Route = createFileRoute("/api/admin/appointments/$appointmentId/email")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const appointment = await getAdminAppointment(params.appointmentId);
        if (!appointment) {
          return Response.json({ message: "Agendamento não encontrado." }, { status: 404 });
        }

        if (!appointment.customerEmail) {
          return Response.json({ message: "Agendamento sem email do cliente." }, { status: 400 });
        }

        const result = await sendSiteEmail({
          type: "appointment_confirmation_resend",
          subject: `Reenvio de confirmação - ${appointment.service || "Agendamento LOMA"}`,
          title: "Confirmação de agendamento reenviada",
          intro:
            "A equipa LOMA reenviou os dados do seu pedido de agendamento para facilitar a consulta.",
          name: appointment.customerName,
          email: appointment.customerEmail,
          phone: appointment.customerPhone,
          fields: [
            { label: "Serviço", value: appointment.service },
            { label: "Profissional", value: appointment.professional },
            { label: "Data e hora", value: appointment.startsAt },
            { label: "Estado", value: appointment.status },
            { label: "Nome", value: appointment.customerName },
            { label: "Email", value: appointment.customerEmail },
            { label: "Telefone", value: appointment.customerPhone },
            { label: "Notas", value: appointment.notes },
          ],
          payload: {
            appointmentId: appointment.id,
            action: "admin_confirmation_resend",
          },
          confirmation: {
            enabled: true,
            subject: "Confirmação de agendamento - LOMA",
            title: "Confirmação de agendamento",
            intro:
              "Recebemos o seu pedido de agendamento. A equipa LOMA entrará em contacto se for necessário ajustar algum detalhe.",
          },
        });

        await markAppointmentEmailResent(appointment.id, result);

        return Response.json({ ok: true, ...result });
      },
    },
  },
});

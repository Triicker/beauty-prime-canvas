import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { BOOKING_TIMES, updateAdminAppointment } from "@/lib/admin/appointments.server";
import { APPOINTMENT_STATUSES } from "@/lib/admin/appointments.types";
import { requireAdmin } from "@/lib/admin/session.server";

const appointmentPatchSchema = z
  .object({
    status: z.enum(APPOINTMENT_STATUSES).optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    time: z
      .string()
      .refine((value) => BOOKING_TIMES.includes(value), "Horário inválido.")
      .optional(),
  })
  .refine((data) => data.status || (data.date && data.time), {
    message: "Informe status ou data e hora para atualizar.",
  })
  .refine((data) => Boolean(data.date) === Boolean(data.time), {
    message: "Informe data e hora juntos para reagendar.",
  });

export const Route = createFileRoute("/api/admin/appointments/$appointmentId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const body = await request.json().catch(() => null);
        const parsed = appointmentPatchSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        let appointment;

        try {
          appointment = await updateAdminAppointment(params.appointmentId, parsed.data);
        } catch (error) {
          return Response.json(
            { message: error instanceof Error ? error.message : "Agendamento não atualizado." },
            { status: 409 },
          );
        }

        if (!appointment) {
          return Response.json({ message: "Agendamento não encontrado." }, { status: 404 });
        }

        return Response.json({ appointment });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { updateAppointmentStatus } from "@/lib/admin/appointments.server";
import { APPOINTMENT_STATUSES } from "@/lib/admin/appointments.types";
import { requireAdmin } from "@/lib/admin/session.server";

const statusSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
});

export const Route = createFileRoute("/api/admin/appointments/$appointmentId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const body = await request.json().catch(() => null);
        const parsed = statusSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const appointment = await updateAppointmentStatus(params.appointmentId, parsed.data.status);
        if (!appointment) {
          return Response.json({ message: "Agendamento não encontrado." }, { status: 404 });
        }

        return Response.json({ appointment });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";

import { listAdminAppointments } from "@/lib/admin/appointments.server";
import { requireAdmin } from "@/lib/admin/session.server";

export const Route = createFileRoute("/api/admin/appointments")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const appointments = await listAdminAppointments();
        return Response.json({ appointments });
      },
    },
  },
});

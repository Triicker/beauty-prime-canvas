import { createFileRoute } from "@tanstack/react-router";

import { listPublicProfessionals } from "@/lib/admin/professionals.server";

export const Route = createFileRoute("/api/professionals")({
  server: {
    handlers: {
      GET: async () => {
        const professionals = await listPublicProfessionals();
        return Response.json({ professionals });
      },
    },
  },
});

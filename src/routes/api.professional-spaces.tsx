import { createFileRoute } from "@tanstack/react-router";

import { listPublicProfessionalSpaces } from "@/lib/admin/professionals.server";

export const Route = createFileRoute("/api/professional-spaces")({
  server: {
    handlers: {
      GET: async () => {
        const spaces = await listPublicProfessionalSpaces();
        return Response.json({ spaces });
      },
    },
  },
});

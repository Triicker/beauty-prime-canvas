import { createFileRoute } from "@tanstack/react-router";

import { listPublicServiceCategories } from "@/lib/admin/services.server";

export const Route = createFileRoute("/api/services")({
  server: {
    handlers: {
      GET: async () => {
        const categories = await listPublicServiceCategories();
        return Response.json({ categories });
      },
    },
  },
});

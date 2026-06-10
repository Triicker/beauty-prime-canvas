import { createFileRoute } from "@tanstack/react-router";

import { getAdminDashboard } from "@/lib/admin/content.server";

export const Route = createFileRoute("/api/admin/dashboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const dashboard = await getAdminDashboard(request);
        return Response.json(dashboard);
      },
    },
  },
});

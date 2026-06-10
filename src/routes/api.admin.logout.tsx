import { createFileRoute } from "@tanstack/react-router";

import { expiredAdminCookie, logoutAdmin } from "@/lib/admin/session.server";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await logoutAdmin(request);
        return Response.json({ ok: true }, { headers: { "set-cookie": expiredAdminCookie() } });
      },
    },
  },
});

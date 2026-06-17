import { createFileRoute } from "@tanstack/react-router";

import { isDatabaseConfigured, queryOne } from "@/lib/admin/db.server";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        if (!isDatabaseConfigured()) {
          return Response.json(
            {
              ok: false,
              database: "not_configured",
            },
            { status: 503 },
          );
        }

        try {
          await queryOne<{ ok: number }>("select 1 as ok");

          return Response.json({
            ok: true,
            database: "ok",
          });
        } catch (error) {
          return Response.json(
            {
              ok: false,
              database: "error",
              message: error instanceof Error ? error.message : "Unknown database error",
            },
            { status: 503 },
          );
        }
      },
    },
  },
});

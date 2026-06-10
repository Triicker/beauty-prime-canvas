import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { loginAdmin } from "@/lib/admin/session.server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = loginSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json({ ok: false, message: "Dados inválidos." }, { status: 400 });
        }

        const result = await loginAdmin(parsed.data.email, parsed.data.password);
        const headers = new Headers();

        if (result.ok && result.cookie) {
          headers.set("set-cookie", result.cookie);
        }

        return Response.json(
          { ok: result.ok, message: result.message },
          { status: result.ok ? 200 : 401, headers },
        );
      },
    },
  },
});

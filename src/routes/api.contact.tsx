import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { sendSiteEmail } from "@/lib/email/mailer.server";
import { enforceRateLimit, publicFormRateLimits } from "@/lib/security/rate-limit.server";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  message: z.string().trim().min(5),
  website: z.string().optional().default(""),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        if (parsed.data.website) {
          return Response.json({ ok: true });
        }

        const rateLimited = await enforceRateLimit(request, publicFormRateLimits.contact);
        if (rateLimited) return rateLimited;

        const result = await sendSiteEmail({
          type: "contact",
          subject: "Novo contacto pelo site LOMA",
          title: "Novo pedido de contacto",
          intro: "Uma pessoa enviou uma mensagem pela página de contactos.",
          name: parsed.data.name,
          email: parsed.data.email,
          fields: [
            { label: "Nome", value: parsed.data.name },
            { label: "Email", value: parsed.data.email },
            { label: "Mensagem", value: parsed.data.message },
          ],
          payload: parsed.data,
          confirmation: {
            enabled: true,
            subject: "Recebemos a sua mensagem - LOMA",
            title: "Mensagem recebida",
            intro:
              "Obrigada pelo contacto. A equipa LOMA recebeu a sua mensagem e responderá o mais brevemente possível.",
          },
        });

        return Response.json({ ok: true, ...result });
      },
    },
  },
});

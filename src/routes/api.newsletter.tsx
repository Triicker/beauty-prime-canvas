import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { sendSiteEmail } from "@/lib/email/mailer.server";
import { enforceRateLimit, publicFormRateLimits } from "@/lib/security/rate-limit.server";

const newsletterSchema = z.object({
  email: z.string().trim().email(),
});

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = newsletterSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Email inválido.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const rateLimited = await enforceRateLimit(request, publicFormRateLimits.newsletter);
        if (rateLimited) return rateLimited;

        const result = await sendSiteEmail({
          type: "newsletter",
          subject: "Nova inscrição na newsletter LOMA",
          title: "Nova inscrição na newsletter",
          intro: "Uma pessoa pediu para receber novidades da LOMA.",
          email: parsed.data.email,
          fields: [{ label: "Email", value: parsed.data.email }],
          payload: parsed.data,
          confirmation: {
            enabled: true,
            subject: "Inscrição recebida - LOMA",
            title: "Inscrição recebida",
            intro: "Obrigada pelo interesse. Recebemos o seu email para futuras novidades da LOMA.",
          },
        });

        return Response.json({ ok: true, ...result });
      },
    },
  },
});

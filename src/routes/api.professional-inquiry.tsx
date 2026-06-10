import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { sendSiteEmail } from "@/lib/email/mailer.server";

const professionalInquirySchema = z.object({
  name: z.string().trim().min(2),
  area: z.string().trim().min(2),
  phone: z.string().trim().min(5),
  instagram: z.string().trim().optional().default(""),
  interest: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
});

export const Route = createFileRoute("/api/professional-inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = professionalInquirySchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const result = await sendSiteEmail({
          type: "professional_inquiry",
          subject: `Nova candidatura profissional - ${parsed.data.name}`,
          title: "Nova candidatura de profissional",
          intro: "Uma pessoa demonstrou interesse em usar os espaços profissionais da LOMA.",
          name: parsed.data.name,
          phone: parsed.data.phone,
          fields: [
            { label: "Nome", value: parsed.data.name },
            { label: "Área", value: parsed.data.area },
            { label: "Telefone", value: parsed.data.phone },
            { label: "Instagram", value: parsed.data.instagram },
            { label: "Interesse", value: parsed.data.interest },
            { label: "Mensagem", value: parsed.data.message },
          ],
          payload: parsed.data,
        });

        return Response.json({ ok: true, ...result });
      },
    },
  },
});

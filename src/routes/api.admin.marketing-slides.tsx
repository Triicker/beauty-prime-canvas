import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { createMarketingSlide, listAdminMarketingSlides } from "@/lib/admin/marketing.server";
import { requireAdmin } from "@/lib/admin/session.server";

const marketingSlideSchema = z.object({
  slug: z.string().optional().default(""),
  eyebrow: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  buttonLabel: z.string().nullable().optional(),
  buttonHref: z.string().nullable().optional(),
  imageUrl: z.string().min(1),
  altText: z.string().nullable().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const Route = createFileRoute("/api/admin/marketing-slides")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const slides = await listAdminMarketingSlides();
        return Response.json({ slides });
      },
      POST: async ({ request }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const body = await request.json().catch(() => null);
        const parsed = marketingSlideSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const slide = await createMarketingSlide(parsed.data);
        return Response.json({ slide }, { status: 201 });
      },
    },
  },
});

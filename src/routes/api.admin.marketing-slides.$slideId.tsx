import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { deleteMarketingSlide, updateMarketingSlide } from "@/lib/admin/marketing.server";
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

export const Route = createFileRoute("/api/admin/marketing-slides/$slideId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
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

        const slide = await updateMarketingSlide(params.slideId, parsed.data);
        if (!slide) return Response.json({ message: "Slide não encontrado." }, { status: 404 });

        return Response.json({ slide });
      },
      DELETE: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        await deleteMarketingSlide(params.slideId);
        return Response.json({ ok: true });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { deleteService, updateService } from "@/lib/admin/services.server";
import { requireAdmin } from "@/lib/admin/session.server";

const serviceSchema = z.object({
  categoryId: z.string().nullable().optional(),
  slug: z.string().optional().default(""),
  namePt: z.string().min(1),
  nameEn: z.string().nullable().optional(),
  nameFr: z.string().nullable().optional(),
  descriptionPt: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionFr: z.string().nullable().optional(),
  priceLabel: z.string().nullable().optional(),
  durationLabel: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const Route = createFileRoute("/api/admin/services/$serviceId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const body = await request.json().catch(() => null);
        const parsed = serviceSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const service = await updateService(params.serviceId, parsed.data);
        if (!service) return Response.json({ message: "Serviço não encontrado." }, { status: 404 });

        return Response.json({ service });
      },
      DELETE: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        await deleteService(params.serviceId);
        return Response.json({ ok: true });
      },
    },
  },
});

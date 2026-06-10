import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  createProfessionalSpace,
  listAdminProfessionalSpaces,
} from "@/lib/admin/professionals.server";
import { requireAdmin } from "@/lib/admin/session.server";

const spaceSchema = z.object({
  slug: z.string().optional().default(""),
  namePt: z.string().min(1),
  nameEn: z.string().nullable().optional(),
  nameFr: z.string().nullable().optional(),
  descriptionPt: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionFr: z.string().nullable().optional(),
  benefitsPt: z.array(z.string()).default([]),
  benefitsEn: z.array(z.string()).default([]),
  benefitsFr: z.array(z.string()).default([]),
  imageUrl: z.string().nullable().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const Route = createFileRoute("/api/admin/professional-spaces")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const spaces = await listAdminProfessionalSpaces();
        return Response.json({ spaces });
      },
      POST: async ({ request }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const body = await request.json().catch(() => null);
        const parsed = spaceSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const space = await createProfessionalSpace(parsed.data);
        return Response.json({ space }, { status: 201 });
      },
    },
  },
});

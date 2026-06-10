import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { deleteProfessional, updateProfessional } from "@/lib/admin/professionals.server";
import { requireAdmin } from "@/lib/admin/session.server";

const professionalSchema = z.object({
  name: z.string().min(1),
  rolePt: z.string().nullable().optional(),
  roleEn: z.string().nullable().optional(),
  roleFr: z.string().nullable().optional(),
  bioPt: z.string().nullable().optional(),
  bioEn: z.string().nullable().optional(),
  bioFr: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const Route = createFileRoute("/api/admin/professionals/$professionalId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const body = await request.json().catch(() => null);
        const parsed = professionalSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const professional = await updateProfessional(params.professionalId, parsed.data);
        if (!professional) {
          return Response.json({ message: "Profissional não encontrado." }, { status: 404 });
        }

        return Response.json({ professional });
      },
      DELETE: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        await deleteProfessional(params.professionalId);
        return Response.json({ ok: true });
      },
    },
  },
});

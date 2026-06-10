import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { deleteProduct, updateProduct } from "@/lib/admin/products.server";
import { requireAdmin } from "@/lib/admin/session.server";

const productSchema = z.object({
  slug: z.string().optional().default(""),
  namePt: z.string().min(1),
  nameEn: z.string().nullable().optional(),
  nameFr: z.string().nullable().optional(),
  descriptionPt: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionFr: z.string().nullable().optional(),
  price: z.coerce.number().nonnegative().nullable().optional(),
  category: z.string().nullable().optional(),
  categories: z.array(z.string()).optional().default([]),
  imageUrl: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const Route = createFileRoute("/api/admin/products/$productId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const body = await request.json().catch(() => null);
        const parsed = productSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const product = await updateProduct(params.productId, parsed.data);
        if (!product) return Response.json({ message: "Produto não encontrado." }, { status: 404 });

        return Response.json({ product });
      },
      DELETE: async ({ request, params }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        await deleteProduct(params.productId);
        return Response.json({ ok: true });
      },
    },
  },
});

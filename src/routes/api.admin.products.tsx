import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { createProduct, listAdminProducts } from "@/lib/admin/products.server";
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

export const Route = createFileRoute("/api/admin/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const user = await requireAdmin(request);
        if (!user) return Response.json({ message: "Não autorizado." }, { status: 401 });

        const products = await listAdminProducts();
        return Response.json({ products });
      },
      POST: async ({ request }) => {
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

        const product = await createProduct(parsed.data);
        return Response.json({ product }, { status: 201 });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";

import { listPublicProducts } from "@/lib/admin/products.server";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async () => {
        const products = await listPublicProducts();
        return Response.json({ products });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";

import { listPublicMarketingSlides } from "@/lib/admin/marketing.server";

export const Route = createFileRoute("/api/marketing-slides")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const slides = await listPublicMarketingSlides();
          return Response.json({ slides });
        } catch {
          return Response.json({ slides: [] });
        }
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { listBookingAvailability } from "@/lib/admin/appointments.server";
import { enforceRateLimit, publicFormRateLimits } from "@/lib/security/rate-limit.server";

const availabilitySchema = z.object({
  serviceId: z.string().uuid(),
  professionalId: z.string().uuid(),
  date: z.string().trim().min(10),
});

export const Route = createFileRoute("/api/booking/availability")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const parsed = availabilitySchema.safeParse({
          serviceId: url.searchParams.get("serviceId"),
          professionalId: url.searchParams.get("professionalId"),
          date: url.searchParams.get("date"),
        });

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const rateLimited = await enforceRateLimit(
          request,
          publicFormRateLimits.bookingAvailability,
        );
        if (rateLimited) return rateLimited;

        const slots = await listBookingAvailability(parsed.data);
        return Response.json({ slots });
      },
    },
  },
});

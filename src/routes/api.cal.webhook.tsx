import { createFileRoute } from "@tanstack/react-router";

import { appointmentFromCalWebhook, upsertAppointment } from "@/lib/admin/appointments.server";

function getEnv(name: string) {
  return process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
}

function getProvidedSecret(request: Request) {
  const url = new URL(request.url);
  const auth = request.headers.get("authorization");

  return (
    url.searchParams.get("secret") ||
    request.headers.get("x-cal-secret") ||
    request.headers.get("x-webhook-secret") ||
    auth?.replace(/^Bearer\s+/i, "") ||
    ""
  );
}

function isAuthorized(request: Request) {
  const expected = getEnv("CAL_WEBHOOK_SECRET");
  if (!expected) return true;

  return getProvidedSecret(request) === expected;
}

export const Route = createFileRoute("/api/cal/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return Response.json({ message: "Webhook não autorizado." }, { status: 401 });
        }

        const body = await request.json().catch(() => null);

        if (!body || typeof body !== "object" || Array.isArray(body)) {
          return Response.json({ message: "Payload inválido." }, { status: 400 });
        }

        const eventName = String(
          body.triggerEvent ?? body.eventType ?? body.type ?? body.event ?? "",
        ).toLowerCase();

        if (eventName.includes("ping") || eventName.includes("test")) {
          return Response.json({ ok: true, ignored: true, reason: "Webhook test event." });
        }

        const appointment = await upsertAppointment(
          appointmentFromCalWebhook(body as Record<string, unknown>),
        );

        return Response.json({ ok: true, appointment });
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { sendSiteEmail } from "@/lib/email/mailer.server";
import { enforceRateLimit, publicFormRateLimits } from "@/lib/security/rate-limit.server";

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
  price: z.coerce.number().nonnegative(),
  qty: z.coerce.number().int().positive(),
});

const cartRequestSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
  items: z.array(cartItemSchema).min(1),
});

export const Route = createFileRoute("/api/cart-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = cartRequestSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const rateLimited = await enforceRateLimit(request, publicFormRateLimits.cartRequest);
        if (rateLimited) return rateLimited;

        const subtotal = parsed.data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const productLines = parsed.data.items.map(
          (item) => `${item.qty}x ${item.name} - ${(item.price * item.qty).toFixed(2)} EUR`,
        );

        let result: Awaited<ReturnType<typeof sendSiteEmail>>;

        try {
          result = await sendSiteEmail({
            type: "cart_request",
            subject: `Nova lista de produtos - ${parsed.data.name}`,
            title: "Nova lista de produtos",
            intro:
              "O cliente enviou uma lista de produtos pelo carrinho. Não houve pagamento online.",
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            fields: [
              { label: "Nome", value: parsed.data.name },
              { label: "Email", value: parsed.data.email },
              { label: "Telefone", value: parsed.data.phone },
              { label: "Produtos", value: productLines.join("\n") },
              { label: "Subtotal estimado", value: `${subtotal.toFixed(2)} EUR` },
              { label: "Notas", value: parsed.data.notes },
            ],
            payload: { ...parsed.data, subtotal },
            confirmation: {
              enabled: true,
              subject: "Recebemos a sua lista de produtos - LOMA",
              title: "Lista de produtos recebida",
              intro:
                "Obrigada pelo interesse nos produtos LOMA. A equipa recebeu a sua lista e entrará em contacto para confirmar disponibilidade e próximos passos.",
            },
          });
        } catch (error) {
          console.error("Cart request email failed", error);

          return Response.json(
            {
              ok: false,
              code: "email_failed",
              message:
                "Não foi possível enviar a lista por email neste momento. Verifique a configuração do Resend.",
            },
            { status: 502 },
          );
        }

        return Response.json({ ok: true, ...result });
      },
    },
  },
});

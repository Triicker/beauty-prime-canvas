import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { sendSiteEmail } from "@/lib/email/mailer.server";
import { enforceRateLimit, publicFormRateLimits } from "@/lib/security/rate-limit.server";

const professionalInquirySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  age: z.string().trim().min(1),
  phone: z.string().trim().min(5),
  instagram: z.string().trim().min(2),
  area: z.string().trim().min(2),
  yearsExperience: z.string().trim().min(1),
  rentalExperience: z.string().trim().min(1),
  ownClientBase: z.string().trim().min(1),
  mainService: z.string().trim().min(2),
  mostPerformedServices: z.string().trim().min(2),
  workspaceExpectations: z.string().trim().min(2),
  whyLoma: z.string().trim().min(2),
  clientExperienceValue: z.string().trim().min(2),
  positioning: z.string().trim().min(2),
  organizedSchedule: z.string().trim().min(1),
  createsContent: z.string().trim().min(1),
  partnershipMeaning: z.string().trim().min(2),
  environmentAvoid: z.string().trim().min(2),
  differentiator: z.string().trim().min(2),
});

export const Route = createFileRoute("/api/professional-inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = professionalInquirySchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            { message: "Dados inválidos.", issues: parsed.error.issues },
            { status: 400 },
          );
        }

        const rateLimited = await enforceRateLimit(
          request,
          publicFormRateLimits.professionalInquiry,
        );
        if (rateLimited) return rateLimited;

        const result = await sendSiteEmail({
          type: "professional_inquiry",
          subject: `Candidatura Profissionais - LOMA - ${parsed.data.name}`,
          title: "Candidatura Profissionais - LOMA",
          intro:
            "Uma pessoa preencheu a candidatura para trabalhar no espaço LOMA como profissional parceiro.",
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          fields: [
            { label: "Nome completo", value: parsed.data.name },
            { label: "Email", value: parsed.data.email },
            { label: "Idade", value: parsed.data.age },
            { label: "Contato", value: parsed.data.phone },
            { label: "Instagram profissional", value: parsed.data.instagram },
            { label: "Área de atuação", value: parsed.data.area },
            { label: "Há quantos anos trabalha na área?", value: parsed.data.yearsExperience },
            { label: "Já trabalhou em regime de aluguer?", value: parsed.data.rentalExperience },
            { label: "Tem carteira de clientes própria?", value: parsed.data.ownClientBase },
            { label: "Principal serviço", value: parsed.data.mainService },
            { label: "Serviços que mais realiza", value: parsed.data.mostPerformedServices },
            {
              label: "O que procura num espaço de trabalho?",
              value: parsed.data.workspaceExpectations,
            },
            { label: "Porque gostaria de integrar no LOMA?", value: parsed.data.whyLoma },
            {
              label: "O que valoriza na experiência do cliente?",
              value: parsed.data.clientExperienceValue,
            },
            {
              label: "Como descreve o posicionamento profissional?",
              value: parsed.data.positioning,
            },
            { label: "Trabalha com agenda organizada?", value: parsed.data.organizedSchedule },
            { label: "Cria conteúdo para redes sociais?", value: parsed.data.createsContent },
            {
              label: "O que significa trabalhar em parceria?",
              value: parsed.data.partnershipMeaning,
            },
            { label: "Ambiente que procura evitar", value: parsed.data.environmentAvoid },
            { label: "Diferencial profissional", value: parsed.data.differentiator },
          ],
          payload: parsed.data,
          confirmation: {
            enabled: true,
            subject: "Recebemos a sua candidatura - LOMA",
            title: "Candidatura recebida",
            intro:
              "Bem vindo(a) ao LOMA. Recebemos a sua candidatura profissional e a equipa irá analisar o seu perfil com atenção.",
          },
        });

        return Response.json({ ok: true, ...result });
      },
    },
  },
});

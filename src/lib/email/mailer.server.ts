import "@tanstack/react-start/server-only";

import { Resend } from "resend";

import { query, queryOne } from "@/lib/admin/db.server";

type EmailField = {
  label: string;
  value: unknown;
};

type SendSiteEmailInput = {
  type: string;
  subject: string;
  title: string;
  intro?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  fields: EmailField[];
  payload: Record<string, unknown>;
  confirmation?: {
    enabled?: boolean;
    subject?: string;
    title?: string;
    intro?: string;
  };
};

type FormSubmissionRow = {
  id: string;
};

type ResendEmailPayload = Parameters<Resend["emails"]["send"]>[0];
type ResendSendError = Error & { statusCode?: number };

const EMAIL_RETRY_DELAYS_MS = [0, 500, 1500] as const;
const DEFAULT_EMAIL_LOGO_URL = "https://midiasave-5c064.web.app/logo-lomaa2.png";

let resend: Resend | undefined;

function getEnv(name: string) {
  return process.env[name] ?? (import.meta.env as Record<string, string | undefined>)[name];
}

function getEmailConfig() {
  const apiKey = getEnv("RESEND_API_KEY");
  const from = getEnv("EMAIL_FROM");
  const to = getEnv("EMAIL_TO");
  const defaultReplyTo = getEnv("EMAIL_REPLY_TO");
  const logoUrl = getEnv("EMAIL_LOGO_URL") || DEFAULT_EMAIL_LOGO_URL;

  if (!apiKey || !from || !to) {
    throw new Error("Email is not configured. Check RESEND_API_KEY, EMAIL_FROM and EMAIL_TO.");
  }

  return {
    apiKey,
    from,
    to: to
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean),
    defaultReplyTo,
    logoUrl,
  };
}

function getResend(apiKey: string) {
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendResendEmailWithRetry(apiKey: string, payload: ResendEmailPayload) {
  let lastError: unknown;

  for (let index = 0; index < EMAIL_RETRY_DELAYS_MS.length; index += 1) {
    const attempt = index + 1;
    const delay = EMAIL_RETRY_DELAYS_MS[index];

    if (delay > 0) {
      await wait(delay);
    }

    try {
      const response = await getResend(apiKey).emails.send(payload);

      if (response.error) {
        throw toResendError(response.error);
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt < EMAIL_RETRY_DELAYS_MS.length && isRetryableEmailError(error)) {
        console.warn(`Resend email attempt ${attempt} failed. Retrying...`, error);
        continue;
      }

      break;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function toResendError(error: { message?: string; name?: string; statusCode?: number }) {
  const resendError = new Error(error.message || "Resend email request failed.") as ResendSendError;
  resendError.name = error.name || "ResendError";
  resendError.statusCode = error.statusCode;
  return resendError;
}

function isRetryableEmailError(error: unknown) {
  const statusCode = error instanceof Error ? (error as ResendSendError).statusCode : undefined;
  if (statusCode && statusCode >= 400 && statusCode < 500) return false;

  const message = error instanceof Error ? error.message : String(error);
  if (/domain.*not verified|verify.*domain|invalid api key|from domain/i.test(message)) {
    return false;
  }

  return true;
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function escapeHtml(value: unknown) {
  return formatValue(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildHtml(input: SendSiteEmailInput, options: { logoUrl: string; footer?: string }) {
  const rows = input.fields
    .map(
      (field) => `
        <tr>
          <td style="padding:13px 18px;border-bottom:1px solid #eadfce;color:#7a5a45;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;width:185px;vertical-align:top;">${escapeHtml(field.label)}</td>
          <td style="padding:13px 18px;border-bottom:1px solid #eadfce;color:#3a2418;font-size:15px;line-height:1.55;white-space:pre-wrap;vertical-align:top;">${escapeHtml(field.value)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background:#f8f1e7;">
        <div style="margin:0;padding:34px 18px;background:#f8f1e7;font-family:Arial,Helvetica,sans-serif;color:#3a2418;">
          <div style="max-width:720px;margin:0 auto;background:#fff9f0;border:1px solid #eadfce;box-shadow:0 18px 50px rgba(58,36,24,0.08);">
            <div style="padding:26px 30px 22px;border-bottom:1px solid #eadfce;background:#fff7ea;text-align:center;">
              <img src="${escapeHtml(options.logoUrl)}" width="180" alt="LOMA Clinic & Beauty Hair" style="display:block;margin:0 auto 16px;max-width:180px;height:auto;border:0;" />
              <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#c99a45;margin-bottom:12px;">LOMA Clinic & Beauty Hair</div>
              <h1 style="margin:0;font-size:30px;line-height:1.18;font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#3a2418;">${escapeHtml(input.title)}</h1>
              ${input.intro ? `<p style="margin:16px auto 0;max-width:560px;color:#7a5a45;font-size:15px;line-height:1.65;">${escapeHtml(input.intro)}</p>` : ""}
            </div>
            <table style="width:100%;border-collapse:collapse;">
              ${rows}
            </table>
            <div style="padding:22px 30px;background:#fff7ea;color:#7a5a45;font-size:12px;line-height:1.65;text-align:center;">
              ${escapeHtml(options.footer || "Enviado automaticamente pelo site lomaexperience.com.")}
              <br />
              <span style="color:#c99a45;">lomaexperience.com</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildText(input: SendSiteEmailInput) {
  const lines = input.fields.map((field) => `${field.label}: ${formatValue(field.value)}`);
  return [
    `${input.title}`,
    input.intro ?? "",
    ...lines,
    "",
    "Enviado pelo site lomaexperience.com.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function createSubmission(input: SendSiteEmailInput) {
  const row = await queryOne<FormSubmissionRow>(
    `
      insert into form_submissions (type, name, email, phone, payload, status)
      values ($1, $2, $3, $4, $5::jsonb, 'pending')
      returning id
    `,
    [
      input.type,
      input.name ?? null,
      input.email ?? null,
      input.phone ?? null,
      JSON.stringify(input.payload),
    ],
  );

  if (!row) throw new Error("Failed to create form submission.");
  return row.id;
}

async function updateSubmissionStatus(id: string, status: string, error?: unknown) {
  const payloadPatch = error
    ? {
        emailError: error instanceof Error ? error.message : String(error),
      }
    : {};

  await query(
    `
      update form_submissions
      set status = $2,
          payload = payload || $3::jsonb
      where id = $1
    `,
    [id, status, JSON.stringify(payloadPatch)],
  );
}

async function appendSubmissionPayload(id: string, payloadPatch: Record<string, unknown>) {
  await query(
    `
      update form_submissions
      set payload = payload || $2::jsonb
      where id = $1
    `,
    [id, JSON.stringify(payloadPatch)],
  );
}

function buildConfirmationInput(input: SendSiteEmailInput): SendSiteEmailInput {
  return {
    ...input,
    subject: input.confirmation?.subject || "Recebemos o seu pedido - LOMA",
    title: input.confirmation?.title || "Recebemos o seu pedido",
    intro:
      input.confirmation?.intro ||
      "Obrigada pelo contacto. A equipa LOMA recebeu a sua mensagem e responderá o mais brevemente possível.",
    fields: input.fields,
  };
}

export async function sendSiteEmail(input: SendSiteEmailInput) {
  const submissionId = await createSubmission(input);

  try {
    const config = getEmailConfig();
    const replyTo = input.email || config.defaultReplyTo || undefined;
    const response = await sendResendEmailWithRetry(config.apiKey, {
      from: config.from,
      to: config.to,
      replyTo,
      subject: input.subject,
      html: buildHtml(input, { logoUrl: config.logoUrl }),
      text: buildText(input),
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    await updateSubmissionStatus(submissionId, "sent");

    if (input.confirmation?.enabled && input.email) {
      const confirmationInput = buildConfirmationInput(input);

      try {
        const confirmationResponse = await sendResendEmailWithRetry(config.apiKey, {
          from: config.from,
          to: input.email,
          replyTo: config.defaultReplyTo || undefined,
          subject: confirmationInput.subject,
          html: buildHtml(confirmationInput, {
            logoUrl: config.logoUrl,
            footer:
              "Esta é uma confirmação automática de receção. A equipa LOMA responderá em breve.",
          }),
          text: buildText(confirmationInput),
        });

        if (confirmationResponse.error) {
          throw new Error(confirmationResponse.error.message);
        }

        await appendSubmissionPayload(submissionId, {
          confirmationEmailId: confirmationResponse.data?.id ?? null,
        });
      } catch (confirmationError) {
        await appendSubmissionPayload(submissionId, {
          confirmationError:
            confirmationError instanceof Error
              ? confirmationError.message
              : String(confirmationError),
        });
      }
    }

    return { submissionId, emailId: response.data?.id ?? null };
  } catch (error) {
    await updateSubmissionStatus(submissionId, "email_failed", error);
    throw error;
  }
}

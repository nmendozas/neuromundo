import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from '../config/env';
import { formatCOP, formatDate } from '../lib/money';
import type { QuoteRow } from '../db/repos/quotes';
import type { ContactMessageInput } from '../db/repos/messages';

/** El envío usa SMTP propio (protocolo estándar), nunca APIs de terceros. */
export function isSmtpConfigured(): boolean {
  return !!env.SMTP_HOST;
}

function buildTransporter(): nodemailer.Transporter {
  if (!isSmtpConfigured()) {
    throw new Error('SMTP no configurado. Define SMTP_HOST, SMTP_USER y SMTP_PASS.');
  }
  const options: SMTPTransport.Options = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
  };
  if (env.SMTP_USER) {
    options.auth = { user: env.SMTP_USER, pass: env.SMTP_PASS };
  }
  return nodemailer.createTransport(options);
}

/** Prueba la conexión SMTP (botón en el panel de parámetros). */
export async function testSmtpConnection(): Promise<void> {
  await buildTransporter().verify();
}

/** Envía una cotización al cliente con el PDF adjunto. */
export async function sendQuoteEmail(
  to: string,
  quote: QuoteRow,
  pdfBuffer: Buffer,
): Promise<void> {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1c3860">
      <h2 style="color:#0c1f3b">NeuroMundo S.A.S</h2>
      <p>Estimado(a) <strong>${quote.client_name}</strong>,</p>
      <p>Adjuntamos la <strong>cotización ${quote.number}</strong> con un valor total de
         <strong style="color:#0e8a71">${formatCOP(quote.total)} ${quote.currency}</strong>.</p>
      <p>Fecha: ${formatDate(quote.created_at)} · Válida por ${quote.valid_days} días.</p>
      <p>Quedamos atentos a tus comentarios. ¡Un mundo de soluciones!</p>
    </div>`;

  await buildTransporter().sendMail({
    from: env.SMTP_FROM,
    to,
    subject: `Cotización ${quote.number} — NeuroMundo S.A.S`,
    html,
    attachments: [{ filename: `${quote.number}.pdf`, content: pdfBuffer }],
  });
}

/** Notificación interna por cada mensaje del formulario de contacto. */
export async function sendContactNotification(
  message: ContactMessageInput,
): Promise<void> {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1c3860">
      <h2 style="color:#0c1f3b">📬 Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${message.name}</p>
      <p><strong>Correo:</strong> ${message.email}</p>
      <p><strong>Teléfono:</strong> ${message.phone ?? '-'}</p>
      <p><strong>Línea de servicio:</strong> ${message.service ?? '-'}</p>
      <p style="white-space:pre-wrap"><strong>Mensaje:</strong><br/>${message.message}</p>
    </div>`;

  await buildTransporter().sendMail({
    from: env.SMTP_FROM,
    to: env.SMTP_FROM,
    subject: `Contacto web — ${message.name}`,
    html,
  });
}

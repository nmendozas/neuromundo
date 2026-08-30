import { z } from 'zod';

/**
 * Variables de entorno validadas con zod.
 * Si falta alguna requerida, la API no arranca (fail-fast).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DB_PATH: z.string().default('./data/neuromundo.db'),
  SESSION_SECRET: z.string().min(8).default('neuromundo-dev-secret-change-me'),
  TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  ADMIN_USERNAME: z.string().min(1).default('admin'),
  ADMIN_PASSWORD: z.string().min(6).default('Admin123!'),
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z
    .string()
    .default('NeuroMundo S.A.S <gerencianeuromundo@gmail.com>'),
  CORS_ORIGIN: z.string().default('*'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Variables de entorno inválidas:',
    JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
  );
  process.exit(1);
}

export const env = parsed.data;

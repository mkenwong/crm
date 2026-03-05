import { z } from "zod/v4";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid environment variables:");
    console.error(z.prettifyError(result.error));
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();

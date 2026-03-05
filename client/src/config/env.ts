import { z } from "zod/v4";

const Environment = z.enum(["local", "production"]);
type Environment = z.infer<typeof Environment>;

const environment = Environment.parse(import.meta.env.VITE_ENVIRONMENT);

function getApiUrl(env: Environment): string {
  switch (env) {
    case "local":
      return "http://localhost:3000";
    case "production":
      return "TODO";
  }
}

export const API_URL = getApiUrl(environment);
export { environment };

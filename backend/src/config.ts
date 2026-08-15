import { z } from 'zod';

import 'dotenv/config';

export const ConfigSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().int(),
    CORS_ORIGIN: z.string(),
    DATABASE_CONNECTION_STRING: z.string().min(1, 'DATABASE_CONNECTION_STRING is required'),
  })
  .transform((config) => ({
    env: config.NODE_ENV,
    port: config.PORT,
    corsOrigin: config.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    databaseConnectionString: config.DATABASE_CONNECTION_STRING,
  }));

export type Config = z.infer<typeof ConfigSchema>;

const result = ConfigSchema.safeParse(process.env);

if (!result.success) {
  console.error('Missing and/or invalid environment variables: ', result.error);

  process.exit(1);
}

const config: Config = Object.freeze(result.data);

export default config;

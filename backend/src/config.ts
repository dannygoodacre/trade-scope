import { z } from 'zod';

import 'dotenv/config';

export const ConfigSchema = z
  .object({
    PORT: z.coerce.number().int(),
    DATABASE_CONNECTION_STRING: z.string()
  })
  .transform(config => ({
    port: config.PORT,
    databaseConnectionString: config.DATABASE_CONNECTION_STRING
  }));

const result = ConfigSchema.safeParse(process.env);

if (!result.success) {
  console.error('Missing and/or invalid environment variables: ', result.error);

  process.exit(1);
}

const config = Object.freeze(result.data);

export default config;

import { cleanEnv, str, port } from 'envalid';

export const env = cleanEnv(process.env, {
  // Database
  DATABASE_URL: str({
    desc: 'PostgreSQL connection string',
  }),

  // JWT
  JWT_SECRET: str({
    desc: 'Secret key for JWT token generation',
  }),

  // Server
  PORT: port({
    default: 3000,
    desc: 'Port number for the server',
  }),

  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
    desc: 'Application environment',
  }),
});

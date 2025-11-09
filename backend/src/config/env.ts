import { cleanEnv, str, port, bool } from 'envalid';

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

  // Frontend
  FRONTEND_URL: str({
    default: 'http://localhost:5173',
    desc: 'Frontend application URL',
  }),

  // Google Cloud
  GCP_PROJECT_ID: str({
    default: '',
    desc: 'Google Cloud Project ID',
  }),

  GCS_BUCKET_NAME: str({
    default: '',
    desc: 'Google Cloud Storage bucket name',
  }),

  USE_CLOUD_STORAGE: bool({
    default: false,
    desc: 'Whether to use Google Cloud Storage for file uploads',
  }),
});

export const config = {
  ...env,
  cookieSecure: env.NODE_ENV === 'production',
  cookieSameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as
    | 'none'
    | 'lax',
} as const;

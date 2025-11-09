import e from 'express';
import app from './app';
import { env } from './config/env';

// Cloud Run sets PORT env var, default to 3000 for local development
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(
    `☁️  Cloud Storage: ${env.USE_CLOUD_STORAGE ? 'Enabled' : 'Disabled'}`
  );
});

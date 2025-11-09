import e from 'express';
import app from './app';
import { env } from './config/env';

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(
    `☁️  Cloud Storage: ${env.USE_CLOUD_STORAGE ? 'Enabled' : 'Disabled'}`
  );
});

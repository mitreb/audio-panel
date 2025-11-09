import app from './app';
import { config } from './config/env';

// Cloud Run provides PORT env var, default to 3000 for local development
const PORT = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
  console.log(
    `☁️  Cloud Storage: ${config.USE_CLOUD_STORAGE ? 'Enabled' : 'Disabled'}`
  );
});

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

  // Debug: Log all config values
  console.log('\n📋 Configuration Debug:');
  console.log('NODE_ENV:', config.NODE_ENV);
  console.log('PORT:', config.PORT);
  console.log('FRONTEND_URL:', config.FRONTEND_URL);
  console.log('USE_CLOUD_STORAGE:', config.USE_CLOUD_STORAGE);
  console.log('GCP_PROJECT_ID:', config.GCP_PROJECT_ID);
  console.log('GCS_BUCKET_NAME:', config.GCS_BUCKET_NAME);
  console.log('cookieSecure:', config.cookieSecure);
  console.log('cookieSameSite:', config.cookieSameSite);
  console.log('JWT_SECRET:', config.JWT_SECRET);
  console.log('DATABASE_URL:', config.DATABASE_URL);
  console.log('');
});

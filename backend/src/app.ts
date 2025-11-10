import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRouter from './features/auth/auth.routes';
import productsRouter from './features/products/products.routes';
import adminRouter from './features/admin/admin.routes';
import { errorHandler } from './shared/middleware/error-handler';
import { config } from './config/env';

const app = express();

// Middleware
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory (only in local mode)
if (!config.USE_CLOUD_STORAGE) {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Audio Panel Backend is running',
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Audio Panel Backend' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/admin', adminRouter);

app.use(errorHandler);

export default app;

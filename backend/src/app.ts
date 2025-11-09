import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './features/auth/auth.routes';
import productsRouter from './features/products/products.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Audio Panel Backend is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Audio Panel Backend' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
);

export default app;

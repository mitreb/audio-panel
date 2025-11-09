import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './features/auth/auth.routes';
import productsRouter from './features/products/products.routes';
import { errorHandler } from './shared/middleware/error-handler';
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Audio Panel Backend is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Audio Panel Backend' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.use(errorHandler);

export default app;

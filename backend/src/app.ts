import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './features/auth/auth.routes';

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

export default app;

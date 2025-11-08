import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Audio Panel Backend is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Audio Panel Backend' });
});

export default app;

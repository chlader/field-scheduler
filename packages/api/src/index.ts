import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fieldsRouter from './routes/fields';
import availabilityRouter from './routes/availability';
import bookingsRouter from './routes/bookings';
import { runMigrations } from './migrate';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/fields', fieldsRouter);
app.use('/api', availabilityRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

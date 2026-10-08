import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

const app = express();

// Configure CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins dynamically if needed
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Standard Request Body Parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Root Status Check Endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'FinTrack 360 API Server',
    status: 'online',
    documentation: '/api/v1/health',
  });
});

// API Routes mounting
app.use('/api/v1', routes);

// 404 Catch-All Middleware
app.use(notFoundHandler);

// Centralized Global Error Handling Middleware
app.use(errorHandler);

export default app;

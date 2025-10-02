import express, { Request, Response, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import { detectLanguage } from './middlewares/langMiddleware.js';
import { config } from './config/config.js';
import errorHandler from './middlewares/errorHandler.js';
import agencyRouter from './routes/agencyRouter.js';
import user from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import notificationRouter from './routes/notificationRouter.js';
import category from './routes/categoryRouter.js';
import listingtype from './routes/listingTypes.js';
import productRouter from './routes/productRouter.js'
import translationRoutes from "./routes/translationRoutes.js";

import { setupSocket } from './socket/socket.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS setup
const corsOrigins = config.server.corsOrigin
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

console.log('🌐 Allowed CORS origins:', corsOrigins);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(detectLanguage);

// Routes
app.use('/api/auth', authRouter);
app.use('/profile', user);
app.use('/agencyapi', agencyRouter);
app.use('/api/notification', notificationRouter);
app.use('/apiCat', category);
app.use('/apiLT', listingtype);
app.use('/product',productRouter);
app.use("/api", translationRoutes);
// Health check endpoints
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Backend is running successfully!',
    port: config.server.port,
    corsOrigins,
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Global error handler
app.use(errorHandler as ErrorRequestHandler);

// HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    credentials: true,
  },
});

setupSocket(io);

server.listen(config.server.port, () => {
  console.log(`🚀 Server running on port ${config.server.port}`);
  console.log(`📡 Health check: http://localhost:${config.server.port}/health`);
});


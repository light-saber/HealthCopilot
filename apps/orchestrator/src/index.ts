import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (3 levels up from src/index.ts)
config({ path: resolve(__dirname, '../../../.env') });

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import chatRoutes from './routes/chat.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    logger.info('HTTP', `${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Express', 'Unhandled error', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`,
    });
});

// Start server
app.listen(PORT, () => {
    logger.info('Server', `Health Copilot Orchestrator running on http://localhost:${PORT}`);
    logger.info('Server', 'Available endpoints:');
    logger.info('Server', '  GET  /health');
    logger.info('Server', '  GET  /api/health/overview');
    logger.info('Server', '  POST /api/health/actions');
    logger.info('Server', '  GET  /api/health/history?days=30');
    logger.info('Server', '  POST /api/chat/message');
    logger.info('Server', '  GET  /api/chat/status');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('Server', 'SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('Server', 'SIGINT received, shutting down gracefully');
    process.exit(0);
});

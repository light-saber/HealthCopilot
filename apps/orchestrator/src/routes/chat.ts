import { Router, Request, Response } from 'express';
import { chatClient } from '../clients/chat-client.js';
import { ultrahumanClient } from '../clients/ultrahuman-client.js';
import { logger } from '../utils/logger.js';
import type { ChatRequest, ChatResponse } from '../types/health.js';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message to the AI with health context
 */
router.post('/message', async (req: Request, res: Response) => {
    try {
        const { message, history = [] } = req.body as ChatRequest;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Message is required and must be a string',
            });
        }

        logger.info('ChatRoute', 'Processing chat message', {
            messageLength: message.length,
            historyLength: history.length,
        });

        // Check if chat is available
        if (!chatClient.isAvailable()) {
            return res.status(503).json({
                error: 'Chat unavailable',
                message: 'No AI API key configured. Please set OPENAI_API_KEY or GEMINI_API_KEY.',
            });
        }

        // Ensure Ultrahuman client is connected for health context
        await ultrahumanClient.connect();

        // Send message to AI
        const aiResponse = await chatClient.sendMessage(message, history);

        const response: ChatResponse = {
            message: aiResponse,
            timestamp: new Date().toISOString(),
        };

        res.json(response);
    } catch (error) {
        logger.error('ChatRoute', 'Failed to process chat message', error);
        res.status(500).json({
            error: 'Failed to process chat message',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * GET /api/chat/status
 * Check if chat is available and which provider is being used
 */
router.get('/status', (req: Request, res: Response) => {
    res.json({
        available: chatClient.isAvailable(),
        provider: chatClient.getProvider(),
    });
});

export default router;

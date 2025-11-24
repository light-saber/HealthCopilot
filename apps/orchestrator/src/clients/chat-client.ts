import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { ChatMessage, MetricsSummary } from '../types/health.js';
import { ultrahumanClient } from './ultrahuman-client.js';

/**
 * AI Chat Client supporting both OpenAI and Gemini
 * Auto-detects which API key is available
 */
export class ChatClient {
    private openai: OpenAI | null = null;
    private gemini: GoogleGenerativeAI | null = null;
    private provider: 'openai' | 'gemini' | null = null;
    private initialized: boolean = false;

    constructor() {
        // Lazy initialization
    }

    private initialize() {
        if (this.initialized) return;

        // Initialize based on available API keys
        if (process.env.OPENAI_API_KEY) {
            this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            this.provider = 'openai';
            logger.info('ChatClient', 'Initialized with OpenAI');
        } else if (process.env.GEMINI_API_KEY) {
            this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.provider = 'gemini';
            logger.info('ChatClient', 'Initialized with Gemini');
        } else {
            logger.warn('ChatClient', 'No AI API key found. Chat feature will not work.');
        }

        this.initialized = true;
    }

    /**
     * Send a chat message with health context
     */
    async sendMessage(
        userMessage: string,
        conversationHistory: ChatMessage[] = []
    ): Promise<string> {
        this.initialize();

        if (!this.provider) {
            throw new Error('No AI API key configured. Please set OPENAI_API_KEY or GEMINI_API_KEY.');
        }

        try {
            // Fetch latest health metrics for context
            const metrics = await ultrahumanClient.getTodaySummary();
            const systemPrompt = this.buildSystemPrompt(metrics);

            if (this.provider === 'openai') {
                return await this.sendOpenAIMessage(systemPrompt, userMessage, conversationHistory);
            } else {
                return await this.sendGeminiMessage(systemPrompt, userMessage, conversationHistory);
            }
        } catch (error) {
            logger.error('ChatClient', 'Failed to send message', error);
            throw error;
        }
    }

    /**
     * Send message using OpenAI
     */
    private async sendOpenAIMessage(
        systemPrompt: string,
        userMessage: string,
        history: ChatMessage[]
    ): Promise<string> {
        if (!this.openai) throw new Error('OpenAI not initialized');

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            ...history.map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
            })),
            { role: 'user', content: userMessage },
        ];

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages,
            temperature: 0.7,
            max_tokens: 1000,
        });

        return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    }

    /**
     * Send message using Gemini
     */
    private async sendGeminiMessage(
        systemPrompt: string,
        userMessage: string,
        history: ChatMessage[]
    ): Promise<string> {
        if (!this.gemini) throw new Error('Gemini not initialized');

        const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Build conversation history
        const conversationParts = [
            { text: systemPrompt },
            ...history.flatMap(msg => [
                { text: `${msg.role}: ${msg.content}` },
            ]),
            { text: `user: ${userMessage}` },
        ];

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: conversationParts }],
        });

        const response = await result.response;
        return response.text() || 'Sorry, I could not generate a response.';
    }

    /**
     * Build system prompt with current health context
     */
    private buildSystemPrompt(metrics: MetricsSummary): string {
        return `You are a knowledgeable health assistant with access to the user's current health data from their Ultrahuman Ring. Be helpful, supportive, and evidence-based in your responses.

**Current Health Data (${metrics.date}):**
- Sleep: ${metrics.sleep.duration.toFixed(1)} hours, Score: ${metrics.sleep.score}/100
  - Deep sleep: ${metrics.sleep.deepSleep.toFixed(1)}h
  - REM sleep: ${metrics.sleep.remSleep.toFixed(1)}h
  - Light sleep: ${metrics.sleep.lightSleep.toFixed(1)}h
- Recovery:
  - HRV: ${metrics.recovery.hrvScore}
  - Resting Heart Rate: ${metrics.recovery.restingHeartRate} bpm
  - Readiness Score: ${metrics.recovery.readinessScore}/100
- Activity:
  - Steps: ${metrics.activity.steps}
  - Active Minutes: ${metrics.activity.activeMinutes}
${metrics.temperature ? `- Temperature Deviation: ${metrics.temperature.deviation}°C` : ''}

**Guidelines:**
1. Use the health data above to provide personalized insights
2. Be conversational and supportive
3. Provide actionable advice when appropriate
4. If asked about specific metrics, reference the data above
5. Keep responses concise (2-3 paragraphs max)
6. If you don't have enough information, ask clarifying questions`;
    }

    /**
     * Check if chat is available
     */
    isAvailable(): boolean {
        this.initialize();
        return this.provider !== null;
    }

    /**
     * Get current provider
     */
    getProvider(): string | null {
        this.initialize();
        return this.provider;
    }
}

// Singleton instance
export const chatClient = new ChatClient();

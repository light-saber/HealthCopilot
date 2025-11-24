import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { HealthAction, MetricsSummary } from '../types/health.js';

/**
 * Gemini-based Action Generator
 * Generates research-backed health recommendations using Gemini
 */
export class ActionGenerator {
    private gemini: GoogleGenerativeAI | null = null;
    private connected: boolean = false;

    async connect(): Promise<void> {
        if (this.connected) return;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }

        this.gemini = new GoogleGenerativeAI(apiKey);
        this.connected = true;
        logger.info('ActionGenerator', 'Connected to Gemini API');
    }

    /**
     * Generate health actions based on current metrics
     */
    async generateHealthActions(
        metrics: MetricsSummary,
        focus?: 'sleep' | 'activity' | 'stress' | 'general'
    ): Promise<HealthAction[]> {
        if (!this.gemini || !this.connected) {
            throw new Error('Action generator not connected');
        }

        const prompt = this.buildPrompt(metrics, focus);

        try {
            logger.info('ActionGenerator', 'Generating health actions', { focus });

            const model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse the response and extract structured actions
            const actions = this.parseActionsResponse(text);
            return actions;
        } catch (error) {
            logger.error('ActionGenerator', 'Failed to generate actions', error);
            throw error;
        }
    }

    /**
     * Build a detailed prompt with health metrics and research requirements
     */
    private buildPrompt(metrics: MetricsSummary, focus?: string): string {
        const focusArea = focus ? ` with a focus on ${focus}` : '';

        return `You are a health research assistant. Based on the following health metrics, provide 3-5 evidence-based, actionable recommendations${focusArea}.

**Current Health Metrics:**
- Sleep: ${metrics.sleep.duration.toFixed(1)} hours, Score: ${metrics.sleep.score}/100
  - Deep sleep: ${metrics.sleep.deepSleep.toFixed(1)}h, REM: ${metrics.sleep.remSleep.toFixed(1)}h
- Recovery:
  - HRV: ${metrics.recovery.hrvScore}
  - Resting Heart Rate: ${metrics.recovery.restingHeartRate} bpm
  - Readiness: ${metrics.recovery.readinessScore}/100
- Activity: ${metrics.activity.steps} steps, ${metrics.activity.activeMinutes} active minutes
${metrics.temperature ? `- Temperature deviation: ${metrics.temperature.deviation}°C` : ''}

**Requirements:**
1. Provide specific, actionable recommendations
2. Reference research from reputable sources (WHO, AASM, major peer-reviewed journals)
3. Include brief evidence summaries
4. Categorize each action (sleep, activity, stress, nutrition, or general)
5. Assign priority (low, medium, high) and time horizon (today, this_week, this_month)

**Format your response as a JSON array:**
[
  {
    "category": "sleep",
    "title": "Brief action title",
    "description": "One-sentence summary",
    "evidenceSummary": "Brief explanation with research backing",
    "evidenceSources": ["Source 1 (e.g., WHO Sleep Guidelines)", "Source 2"],
    "priority": "high",
    "timeHorizon": "today"
  }
]

Provide only the JSON array, no additional text or markdown formatting.`;
    }

    /**
     * Parse Gemini response into structured HealthAction array
     */
    private parseActionsResponse(response: string): HealthAction[] {
        try {
            // Extract JSON from response (remove markdown code blocks if present)
            let jsonStr = response.trim();
            const jsonMatch = jsonStr.match(/```json\n([\s\S]*?)\n```/) ||
                jsonStr.match(/```\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                jsonStr = jsonMatch[1];
            }

            // Remove any leading/trailing text that's not JSON
            const arrayStart = jsonStr.indexOf('[');
            const arrayEnd = jsonStr.lastIndexOf(']');
            if (arrayStart !== -1 && arrayEnd !== -1) {
                jsonStr = jsonStr.substring(arrayStart, arrayEnd + 1);
            }

            const actionsData = JSON.parse(jsonStr);

            // Normalize and validate actions
            return actionsData.map((action: any, index: number) => ({
                id: `action-${Date.now()}-${index}`,
                category: action.category || 'general',
                title: action.title || 'Health Recommendation',
                description: action.description || '',
                evidenceSummary: action.evidenceSummary || '',
                evidenceSources: action.evidenceSources || [],
                priority: action.priority || 'medium',
                timeHorizon: action.timeHorizon || 'this_week',
            }));
        } catch (error) {
            logger.error('ActionGenerator', 'Failed to parse actions response', error);

            // Return fallback actions if parsing fails
            return [{
                id: `action-${Date.now()}-0`,
                category: 'general',
                title: 'Review your health metrics',
                description: 'Take time to understand your current health status',
                evidenceSummary: 'Regular health monitoring is associated with better health outcomes',
                evidenceSources: ['General health guidelines'],
                priority: 'medium',
                timeHorizon: 'today',
            }];
        }
    }

    async disconnect(): Promise<void> {
        this.connected = false;
        logger.info('ActionGenerator', 'Disconnected');
    }
}

// Singleton instance
export const actionGenerator = new ActionGenerator();

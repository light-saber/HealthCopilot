/**
 * TypeScript type definitions for health data and API contracts
 */

export interface HealthAction {
    id: string;
    category: 'sleep' | 'activity' | 'stress' | 'nutrition' | 'general';
    title: string;
    description: string;
    evidenceSummary: string;
    evidenceSources: string[];
    priority: 'low' | 'medium' | 'high';
    timeHorizon: 'today' | 'this_week' | 'this_month';
}

export interface MetricsSummary {
    date: string;
    sleep: {
        duration: number; // hours
        score: number; // 0-100
        deepSleep: number; // hours
        remSleep: number; // hours
        lightSleep: number; // hours
    };
    recovery: {
        hrvScore: number;
        restingHeartRate: number;
        readinessScore: number;
    };
    activity: {
        steps: number;
        activeMinutes: number;
    };
    temperature?: {
        deviation: number;
    };
}

export interface TrendData {
    date: string;
    value: number;
    label?: string;
}

export interface HealthOverview {
    today: MetricsSummary;
    trends: {
        sleep7Day: TrendData[];
        sleep30Day: TrendData[];
        hrv7Day: TrendData[];
        hrv30Day: TrendData[];
        rhr7Day: TrendData[];
        rhr30Day: TrendData[];
    };
}

export interface GenerateActionsRequest {
    focus?: 'sleep' | 'activity' | 'stress' | 'general';
}

export interface GenerateActionsResponse {
    actions: HealthAction[];
    metrics: MetricsSummary;
    generatedAt: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: string;
}

export interface ChatRequest {
    message: string;
    history?: ChatMessage[];
}

export interface ChatResponse {
    message: string;
    timestamp: string;
}

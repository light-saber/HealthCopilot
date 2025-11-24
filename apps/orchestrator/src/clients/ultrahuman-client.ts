import { logger } from '../utils/logger.js';
import { MetricsSummary, TrendData } from '../types/health.js';

/**
 * Ultrahuman HTTP API Client
 * Direct HTTP client for Ultrahuman API (simpler than MCP)
 */
export class UltrahumanClient {
    private authToken: string | null = null;
    private userEmail: string | null = null;
    private connected: boolean = false;
    private baseUrl = 'https://api.ultrahuman.com';

    async connect(): Promise<void> {
        if (this.connected) return;

        this.authToken = process.env.ULTRAHUMAN_AUTH_TOKEN || null;
        this.userEmail = process.env.ULTRAHUMAN_USER_EMAIL || null;

        if (!this.authToken || !this.userEmail) {
            throw new Error('ULTRAHUMAN_AUTH_TOKEN and ULTRAHUMAN_USER_EMAIL must be set');
        }

        this.connected = true;
        logger.info('UltrahumanClient', 'Connected to Ultrahuman API');
    }

    /**
     * Get today's health metrics summary
     */
    async getTodaySummary(): Promise<MetricsSummary> {
        const today = new Date().toISOString().split('T')[0];
        return this.getMetricsForDate(today);
    }

    /**
   * Get metrics for a specific date
   */
    private async getMetricsForDate(date: string): Promise<MetricsSummary> {
        if (!this.connected || !this.authToken) {
            throw new Error('Ultrahuman client not connected');
        }

        try {
            // Generate deterministic random data based on the date string
            // This ensures the data is consistent for the same date but varies across days
            const seed = date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const random = (min: number, max: number) => {
                const x = Math.sin(seed + min + max) * 10000;
                return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
            };

            const randomFloat = (min: number, max: number) => {
                const x = Math.sin(seed + min + max + 1) * 10000;
                return min + (x - Math.floor(x)) * (max - min);
            };

            logger.warn('UltrahumanClient', 'Using mock data - real API integration pending');

            return {
                date,
                sleep: {
                    duration: randomFloat(5.5, 9.0),
                    score: random(60, 95),
                    deepSleep: randomFloat(1.0, 2.5),
                    remSleep: randomFloat(1.0, 2.5),
                    lightSleep: randomFloat(3.0, 5.0),
                },
                recovery: {
                    hrvScore: random(40, 90),
                    restingHeartRate: random(50, 70),
                    readinessScore: random(65, 98),
                },
                activity: {
                    steps: random(4000, 15000),
                    activeMinutes: random(20, 90),
                },
            };
        } catch (error) {
            logger.error('UltrahumanClient', `Failed to get metrics for ${date}`, error);
            throw error;
        }
    }

    /**
     * Get sleep summary for the last N days
     */
    async getSleepSummary(rangeDays: number = 7): Promise<TrendData[]> {
        const dates = this.getDateRange(rangeDays);
        const sleepData: TrendData[] = [];

        for (const date of dates) {
            try {
                const metrics = await this.getMetricsForDate(date);
                sleepData.push({
                    date,
                    value: metrics.sleep.score,
                    label: `${metrics.sleep.duration.toFixed(1)}h`,
                });
            } catch (error) {
                logger.warn('UltrahumanClient', `Failed to get sleep data for ${date}`, error);
            }
        }

        return sleepData;
    }

    /**
     * Get HRV trend for the last N days
     */
    async getHrvTrend(rangeDays: number = 7): Promise<TrendData[]> {
        const dates = this.getDateRange(rangeDays);
        const hrvData: TrendData[] = [];

        for (const date of dates) {
            try {
                const metrics = await this.getMetricsForDate(date);
                hrvData.push({
                    date,
                    value: metrics.recovery.hrvScore,
                });
            } catch (error) {
                logger.warn('UltrahumanClient', `Failed to get HRV data for ${date}`, error);
            }
        }

        return hrvData;
    }

    /**
     * Get activity summary for the last N days
     */
    async getActivitySummary(rangeDays: number = 7): Promise<TrendData[]> {
        const dates = this.getDateRange(rangeDays);
        const activityData: TrendData[] = [];

        for (const date of dates) {
            try {
                const metrics = await this.getMetricsForDate(date);
                activityData.push({
                    date,
                    value: metrics.activity.steps,
                });
            } catch (error) {
                logger.warn('UltrahumanClient', `Failed to get activity data for ${date}`, error);
            }
        }

        return activityData;
    }

    /**
     * Generate array of dates for the last N days
     */
    private getDateRange(days: number): string[] {
        const dates: string[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }

        return dates;
    }

    async disconnect(): Promise<void> {
        this.connected = false;
        logger.info('UltrahumanClient', 'Disconnected');
    }
}

// Singleton instance
export const ultrahumanClient = new UltrahumanClient();

import { Router, Request, Response } from 'express';
import { ultrahumanClient } from '../clients/ultrahuman-client.js';
import { actionGenerator } from '../clients/perplexity-client.js';
import { logger } from '../utils/logger.js';
import { calculateRecoveryScore } from '../utils/recovery.js';
import type { GenerateActionsRequest, GenerateActionsResponse, HealthOverview } from '../types/health.js';

const router = Router();

/**
 * GET /api/health/overview
 * Returns today's metrics and recent trends
 */
router.get('/overview', async (req: Request, res: Response) => {
    try {
        logger.info('HealthRoute', 'Fetching health overview');

        // Ensure client is connected
        await ultrahumanClient.connect();

        // Fetch today's metrics
        const today = await ultrahumanClient.getTodaySummary();

        // Fetch trends
        const [sleep7Day, sleep30Day, hrv7Day, hrv30Day] = await Promise.all([
            ultrahumanClient.getSleepSummary(7),
            ultrahumanClient.getSleepSummary(30),
            ultrahumanClient.getHrvTrend(7),
            ultrahumanClient.getHrvTrend(30),
        ]);

        // Calculate RHR trends
        const rhr7Day = hrv7Day.map(item => ({
            date: item.date,
            value: 0, // Will be populated from actual data
        }));
        const rhr30Day = hrv30Day.map(item => ({
            date: item.date,
            value: 0,
        }));

        // Calculate recovery score
        const avgHrv = hrv7Day.reduce((sum, d) => sum + d.value, 0) / hrv7Day.length;
        const avgRhr = today.recovery.restingHeartRate; // Use current as baseline for now

        const recoveryScore = calculateRecoveryScore(today, { avgHrv, avgRhr });

        const overview: HealthOverview = {
            today: {
                ...today,
                recovery: {
                    ...today.recovery,
                    readinessScore: recoveryScore,
                },
            },
            trends: {
                sleep7Day,
                sleep30Day,
                hrv7Day,
                hrv30Day,
                rhr7Day,
                rhr30Day,
            },
        };

        res.json(overview);
    } catch (error) {
        logger.error('HealthRoute', 'Failed to fetch overview', error);
        res.status(500).json({
            error: 'Failed to fetch health overview',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * POST /api/health/actions
 * Generate research-backed health actions
 */
router.post('/actions', async (req: Request, res: Response) => {
    try {
        const { focus } = req.body as GenerateActionsRequest;

        logger.info('HealthRoute', 'Generating health actions', { focus });

        // Ensure clients are connected
        await ultrahumanClient.connect();
        await actionGenerator.connect();

        // Fetch current metrics
        const metrics = await ultrahumanClient.getTodaySummary();

        // Generate actions
        const actions = await actionGenerator.generateHealthActions(metrics, focus);

        const response: GenerateActionsResponse = {
            actions,
            metrics,
            generatedAt: new Date().toISOString(),
        };

        res.json(response);
    } catch (error) {
        logger.error('HealthRoute', 'Failed to generate actions', error);
        res.status(500).json({
            error: 'Failed to generate health actions',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * GET /api/health/history
 * Get time-series data for charts
 */
router.get('/history', async (req: Request, res: Response) => {
    try {
        const days = parseInt(req.query.days as string) || 30;

        logger.info('HealthRoute', 'Fetching health history', { days });

        // Ensure client is connected
        await ultrahumanClient.connect();

        // Fetch historical data
        const [sleepData, hrvData, activityData] = await Promise.all([
            ultrahumanClient.getSleepSummary(days),
            ultrahumanClient.getHrvTrend(days),
            ultrahumanClient.getActivitySummary(days),
        ]);

        res.json({
            sleep: sleepData,
            hrv: hrvData,
            activity: activityData,
        });
    } catch (error) {
        logger.error('HealthRoute', 'Failed to fetch history', error);
        res.status(500).json({
            error: 'Failed to fetch health history',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;

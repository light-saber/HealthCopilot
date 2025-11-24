import { MetricsSummary } from '../types/health.js';

/**
 * Calculate composite recovery score from health metrics
 * 
 * Formula:
 * - Sleep Score: 40% weight
 * - HRV vs 7-day average: 30% weight
 * - RHR deviation from baseline: 20% weight
 * - Activity readiness: 10% weight
 * 
 * Returns a score from 0-100
 */
export function calculateRecoveryScore(
    today: MetricsSummary,
    baseline: {
        avgHrv: number;
        avgRhr: number;
    }
): number {
    // Sleep score contribution (40%)
    const sleepContribution = (today.sleep.score / 100) * 40;

    // HRV contribution (30%)
    // Higher HRV is better, normalize to percentage above/below baseline
    const hrvRatio = today.recovery.hrvScore / baseline.avgHrv;
    const hrvContribution = Math.min(Math.max(hrvRatio, 0.5), 1.5) * 20; // Cap at 30

    // RHR contribution (20%)
    // Lower RHR is better, invert the ratio
    const rhrRatio = baseline.avgRhr / today.recovery.restingHeartRate;
    const rhrContribution = Math.min(Math.max(rhrRatio, 0.5), 1.5) * 13.33; // Cap at 20

    // Readiness contribution (10%)
    const readinessContribution = (today.recovery.readinessScore / 100) * 10;

    const totalScore = Math.round(
        sleepContribution + hrvContribution + rhrContribution + readinessContribution
    );

    return Math.min(Math.max(totalScore, 0), 100);
}

/**
 * Get color code for recovery score
 */
export function getRecoveryColor(score: number): 'green' | 'amber' | 'red' {
    if (score >= 80) return 'green';
    if (score >= 60) return 'amber';
    return 'red';
}

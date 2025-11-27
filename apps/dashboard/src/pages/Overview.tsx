import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Stack,
    Title,
    Button,
    Loader,
    Alert,
    Text,
    Group,
} from '@mantine/core';
import { IconAlertCircle, IconSparkles } from '@tabler/icons-react';
import { healthApi } from '../services/api';
import { RecoveryScore } from '../components/RecoveryScore';
import { MetricCard } from '../components/MetricCard';
import { TrendChart } from '../components/TrendChart';
import { ActionCard } from '../components/ActionCard';
import { useLocalStorage } from '../hooks/useLocalStorage';


export function Overview() {
    const [overview, setOverview] = useState<any>(null);
    const [actions, setActions] = useLocalStorage<any[]>('health-copilot-actions', []);
    const [loading, setLoading] = useState(true);
    const [actionsLoading, setActionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionStatuses, setActionStatuses] = useLocalStorage<Record<string, string>>(
        'action-statuses',
        {}
    );

    useEffect(() => {
        loadOverview();
    }, []);

    const loadOverview = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await healthApi.getOverview();
            setOverview(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load health data');
        } finally {
            setLoading(false);
        }
    };

    const generateActions = async () => {
        try {
            setActionsLoading(true);
            const data = await healthApi.generateActions();
            setActions(data.actions);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate actions');
        } finally {
            setActionsLoading(false);
        }
    };

    const handleStatusChange = (actionId: string, status: string) => {
        setActionStatuses((prev) => ({ ...prev, [actionId]: status }));
    };

    if (loading) {
        return (
            <Container size="xl" py="xl">
                <Stack align="center" justify="center" style={{ minHeight: 400 }}>
                    <Loader size="lg" />
                    <Text color="dimmed">Loading your health data...</Text>
                </Stack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="xl" py="xl">
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!overview) return null;

    const { today, trends } = overview;

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Group justify="space-between" align="center">
                    <Title order={1}>Health Overview</Title>
                </Group>

                {/* Research-backed Actions */}
                <Stack gap="md">
                    <Title order={2}>Research-Backed Actions</Title>

                    {actions.length === 0 ? (
                        <Button
                            leftSection={<IconSparkles size={20} />}
                            size="lg"
                            onClick={generateActions}
                            loading={actionsLoading}
                        >
                            Generate Today's Plan
                        </Button>
                    ) : (
                        <Stack gap="md">
                            {actions.map((action) => (
                                <ActionCard
                                    key={action.id}
                                    action={action}
                                    status={(actionStatuses[action.id] as any) || 'none'}
                                    onStatusChange={(status) => handleStatusChange(action.id, status)}
                                />
                            ))}
                            <Button
                                variant="light"
                                onClick={generateActions}
                                loading={actionsLoading}
                            >
                                Regenerate Plan
                            </Button>
                        </Stack>
                    )}
                </Stack>

                {/* Recovery Score Hero */}
                <RecoveryScore score={today.recovery.readinessScore} />

                {/* Metrics Grid */}
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Sleep Duration"
                            value={today.sleep.duration.toFixed(1)}
                            unit="hours"
                            status={today.sleep.score >= 80 ? 'good' : today.sleep.score >= 60 ? 'warning' : 'bad'}
                            comparison={{
                                value: 0.2,
                                label: 'vs avg',
                            }}
                            sparklineData={trends.sleep7Day.map((d: any) => ({ value: d.value }))}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="HRV"
                            value={today.recovery.hrvScore}
                            status="good"
                            sparklineData={trends.hrv7Day.map((d: any) => ({ value: d.value }))}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Resting Heart Rate"
                            value={today.recovery.restingHeartRate}
                            unit="bpm"
                            status="good"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                        <MetricCard
                            title="Steps"
                            value={today.activity.steps.toLocaleString()}
                            status={today.activity.steps >= 8000 ? 'good' : 'warning'}
                        />
                    </Grid.Col>
                </Grid>

                {/* Trend Charts */}
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TrendChart
                            title="Sleep Score (14 days)"
                            data={trends.sleep7Day}
                            dataKeys={[{ key: 'value', color: '#4fc3f7', name: 'Sleep Score' }]}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TrendChart
                            title="HRV & RHR Trend"
                            data={trends.hrv7Day}
                            dataKeys={[
                                { key: 'value', color: '#29b6f6', name: 'HRV' },
                            ]}
                        />
                    </Grid.Col>
                </Grid>


            </Stack>
        </Container>
    );
}

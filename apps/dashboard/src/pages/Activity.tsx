import { useState, useEffect } from 'react';
import { Container, Stack, Title, Text, Loader } from '@mantine/core';
import { healthApi } from '../services/api';
import { TrendChart } from '../components/TrendChart';

export function Activity() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const history = await healthApi.getHistory(14);
            setData(history);
        } catch (err) {
            console.error('Failed to load activity data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container size="xl" py="xl">
                <Stack align="center" justify="center" style={{ minHeight: 400 }}>
                    <Loader size="lg" />
                </Stack>
            </Container>
        );
    }

    if (!data) return null;

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Title order={1}>Activity Tracking</Title>

                <Text color="dimmed">
                    Stay active and monitor your daily movement patterns.
                </Text>

                <TrendChart
                    title="Daily Steps (14 days)"
                    data={data.activity}
                    type="bar"
                    dataKeys={[{ key: 'value', color: '#66bb6a', name: 'Steps' }]}
                    height={350}
                />

                <Stack gap="md">
                    <Title order={3}>Activity Tips</Title>
                    <Text size="sm" color="dimmed">
                        • Aim for 8,000-10,000 steps per day
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Break up long periods of sitting
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Include both cardio and strength training
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Listen to your body and rest when needed
                    </Text>
                </Stack>
            </Stack>
        </Container>
    );
}

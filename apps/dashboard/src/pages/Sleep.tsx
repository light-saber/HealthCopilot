import { useState, useEffect } from 'react';
import { Container, Stack, Title, Text, Loader } from '@mantine/core';
import { healthApi } from '../services/api';
import { TrendChart } from '../components/TrendChart';
import { MetricCard } from '../components/MetricCard';

export function Sleep() {
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
            console.error('Failed to load sleep data:', err);
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
            <Stack spacing="xl">
                <Title order={1}>Sleep Analysis</Title>

                <Text color="dimmed">
                    Track your sleep patterns and optimize your rest for better recovery.
                </Text>

                <TrendChart
                    title="Sleep Duration (14 days)"
                    data={data.sleep}
                    dataKeys={[{ key: 'value', color: '#4fc3f7', name: 'Sleep Score' }]}
                    height={350}
                />

                <Stack spacing="md">
                    <Title order={3}>Sleep Tips</Title>
                    <Text size="sm" color="dimmed">
                        • Aim for 7-9 hours of sleep per night
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Maintain a consistent sleep schedule
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Keep your bedroom cool (60-67°F / 15-19°C)
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Avoid screens 1 hour before bed
                    </Text>
                </Stack>
            </Stack>
        </Container>
    );
}

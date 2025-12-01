import { useState, useEffect } from 'react';
import { Container, Stack, Title, Text, Loader } from '@mantine/core';
import { healthApi } from '../services/api';
import { TrendChart } from '../components/TrendChart';


export function Recovery() {
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
            console.error('Failed to load recovery data:', err);
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
                <Title order={1}>Recovery Metrics</Title>

                <Text color="dimmed">
                    Monitor your body's recovery status through HRV and resting heart rate.
                </Text>

                <TrendChart
                    title="HRV Trend (14 days)"
                    data={data.hrv}
                    dataKeys={[{ key: 'value', color: '#29b6f6', name: 'HRV' }]}
                    height={350}
                />

                <Stack gap="md">
                    <Title order={3}>Recovery Tips</Title>
                    <Text size="sm" color="dimmed">
                        • Higher HRV indicates better recovery
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Lower resting heart rate is generally better
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Prioritize sleep when HRV is low
                    </Text>
                    <Text size="sm" color="dimmed">
                        • Consider active recovery on low readiness days
                    </Text>
                </Stack>
            </Stack>
        </Container>
    );
}

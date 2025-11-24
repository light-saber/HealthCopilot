import { Card, RingProgress, Text, Stack, Group, useMantineTheme } from '@mantine/core';

interface RecoveryScoreProps {
    score: number;
    breakdown?: {
        sleep: number;
        hrv: number;
        rhr: number;
        activity: number;
    };
}

export function RecoveryScore({ score, breakdown }: RecoveryScoreProps) {
    const theme = useMantineTheme();

    const getColor = (score: number) => {
        if (score >= 80) return theme.colors.green[6];
        if (score >= 60) return theme.colors.yellow[6];
        return theme.colors.red[6];
    };

    const color = getColor(score);

    return (
        <Card padding="xl" radius="md">
            <Stack align="center" gap="lg">
                <Text size="xl" fw={600}>
                    Today's Recovery
                </Text>

                <RingProgress
                    size={200}
                    thickness={20}
                    sections={[{ value: score, color }]}
                    label={
                        <Stack align="center" gap={0}>
                            <Text fw={700} style={{ fontSize: 48, lineHeight: 1 }}>
                                {score}
                            </Text>
                            <Text size="sm" c="dimmed">
                                / 100
                            </Text>
                        </Stack>
                    }
                />

                {breakdown && (
                    <Group gap="xl" justify="center">
                        <Stack align="center" gap={4}>
                            <Text size="xs" c="dimmed">
                                Sleep
                            </Text>
                            <Text size="lg" fw={600}>
                                {breakdown.sleep}%
                            </Text>
                        </Stack>
                        <Stack align="center" gap={4}>
                            <Text size="xs" c="dimmed">
                                HRV
                            </Text>
                            <Text size="lg" fw={600}>
                                {breakdown.hrv}%
                            </Text>
                        </Stack>
                        <Stack align="center" gap={4}>
                            <Text size="xs" c="dimmed">
                                RHR
                            </Text>
                            <Text size="lg" fw={600}>
                                {breakdown.rhr}%
                            </Text>
                        </Stack>
                        <Stack align="center" gap={4}>
                            <Text size="xs" c="dimmed">
                                Activity
                            </Text>
                            <Text size="lg" fw={600}>
                                {breakdown.activity}%
                            </Text>
                        </Stack>
                    </Group>
                )}
            </Stack>
        </Card>
    );
}

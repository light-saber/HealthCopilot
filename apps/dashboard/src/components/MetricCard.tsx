import { Card, Text, Group, Stack, Badge, useMantineTheme } from '@mantine/core';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    comparison?: {
        value: number;
        label: string;
    };
    status?: 'good' | 'warning' | 'bad';
    sparklineData?: Array<{ value: number }>;
}

export function MetricCard({
    title,
    value,
    unit,
    comparison,
    status = 'good',
    sparklineData,
}: MetricCardProps) {
    const theme = useMantineTheme();

    const statusColors = {
        good: theme.colors.green[6],
        warning: theme.colors.yellow[6],
        bad: theme.colors.red[6],
    };

    return (
        <Card padding="lg" radius="md">
            <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                    {title}
                </Text>

                <Group justify="space-between" align="flex-end">
                    <Group gap={4} align="baseline">
                        <Text size="xl" fw={700} style={{ lineHeight: 1, fontSize: '32px' }}>
                            {value}
                        </Text>
                        {unit && (
                            <Text size="sm" c="dimmed">
                                {unit}
                            </Text>
                        )}
                    </Group>

                    {comparison && (
                        <Badge
                            color={statusColors[status]}
                            variant="light"
                            size="sm"
                        >
                            {comparison.value > 0 ? '+' : ''}
                            {comparison.value} {comparison.label}
                        </Badge>
                    )}
                </Group>

                {sparklineData && sparklineData.length > 0 && (
                    <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={sparklineData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={statusColors[status]}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Stack>
        </Card>
    );
}

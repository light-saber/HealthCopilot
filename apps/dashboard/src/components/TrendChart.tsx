import { Card, Title } from '@mantine/core';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface TrendChartProps {
    title: string;
    data: Array<any>;
    type?: 'line' | 'bar' | 'stacked-bar';
    dataKeys: Array<{
        key: string;
        color: string;
        name?: string;
    }>;
    height?: number;
}

export function TrendChart({
    title,
    data,
    type = 'line',
    dataKeys,
    height = 300,
}: TrendChartProps) {
    return (
        <Card padding="lg" radius="md">
            <Title order={4} mb="md">
                {title}
            </Title>

            <ResponsiveContainer width="100%" height={height}>
                {type === 'line' ? (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1f2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        {dataKeys.map((dk) => (
                            <Line
                                key={dk.key}
                                type="monotone"
                                dataKey={dk.key}
                                stroke={dk.color}
                                strokeWidth={2}
                                name={dk.name || dk.key}
                                dot={{ fill: dk.color, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        ))}
                    </LineChart>
                ) : (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1f2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        {dataKeys.map((dk) => (
                            <Bar
                                key={dk.key}
                                dataKey={dk.key}
                                fill={dk.color}
                                name={dk.name || dk.key}
                                stackId={type === 'stacked-bar' ? 'stack' : undefined}
                            />
                        ))}
                    </BarChart>
                )}
            </ResponsiveContainer>
        </Card>
    );
}

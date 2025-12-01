import { Card, Text, Badge, Stack, Group, Collapse, Button, Anchor } from '@mantine/core';
import { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface ActionCardProps {
    action: {
        id: string;
        category: string;
        title: string;
        description: string;
        evidenceSummary: string;
        evidenceSources: string[];
        priority: string;
        timeHorizon: string;
    };
    status?: 'none' | 'planned' | 'in-progress' | 'done' | 'skip';
    onStatusChange?: (status: string) => void;
}

const categoryColors: Record<string, string> = {
    sleep: 'blue',
    activity: 'green',
    stress: 'orange',
    nutrition: 'grape',
    general: 'gray',
};

const priorityColors: Record<string, string> = {
    high: 'red',
    medium: 'yellow',
    low: 'gray',
};

export function ActionCard({ action, status = 'none', onStatusChange }: ActionCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card padding="lg" radius="md">
            <Stack gap="sm">
                <Group justify="space-between">
                    <Badge color={categoryColors[action.category] || 'gray'} variant="light">
                        {action.category}
                    </Badge>
                    <Badge color={priorityColors[action.priority] || 'gray'} size="sm">
                        {action.priority} priority
                    </Badge>
                </Group>

                <Text size="lg" fw={600}>
                    {action.title}
                </Text>

                <Text size="sm" color="dimmed">
                    {action.description}
                </Text>

                <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => setExpanded(!expanded)}
                    rightSection={expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                >
                    {expanded ? 'Hide details' : 'Show details'}
                </Button>

                <Collapse in={expanded}>
                    <Stack gap="sm" mt="sm">
                        <div>
                            <Text size="sm" fw={500} mb={4}>
                                Evidence Summary
                            </Text>
                            <Text size="sm" color="dimmed">
                                {action.evidenceSummary}
                            </Text>
                        </div>

                        {action.evidenceSources.length > 0 && (
                            <div>
                                <Text size="sm" fw={500} mb={4}>
                                    Sources
                                </Text>
                                <Stack gap={4}>
                                    {action.evidenceSources.map((source, idx) => (
                                        <Anchor
                                            key={idx}
                                            href={source}
                                            target="_blank"
                                            size="sm"
                                            style={{ wordBreak: 'break-all' }}
                                        >
                                            {source}
                                        </Anchor>
                                    ))}
                                </Stack>
                            </div>
                        )}
                    </Stack>
                </Collapse>

                {onStatusChange && (
                    <Group gap="xs" mt="sm">
                        <Button
                            size="xs"
                            variant={status === 'planned' ? 'filled' : 'light'}
                            onClick={() => onStatusChange('planned')}
                        >
                            Planned
                        </Button>
                        <Button
                            size="xs"
                            variant={status === 'in-progress' ? 'filled' : 'light'}
                            onClick={() => onStatusChange('in-progress')}
                        >
                            In Progress
                        </Button>
                        <Button
                            size="xs"
                            variant={status === 'done' ? 'filled' : 'light'}
                            color="green"
                            onClick={() => onStatusChange('done')}
                        >
                            Done
                        </Button>
                        <Button
                            size="xs"
                            variant={status === 'skip' ? 'filled' : 'light'}
                            color="gray"
                            onClick={() => onStatusChange('skip')}
                        >
                            Skip
                        </Button>
                    </Group>
                )}
            </Stack>
        </Card>
    );
}

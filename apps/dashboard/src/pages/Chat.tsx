import { useState, useEffect, useRef } from 'react';
import {
    Container,
    Stack,
    Title,
    Text,
    TextInput,
    Button,
    Paper,
    Group,
    Badge,
    Loader,
    Alert,
    ScrollArea,
} from '@mantine/core';
import { IconSend, IconRobot, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { chatApi } from '../services/api';
import { useSessionStorage } from '../hooks/useSessionStorage';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

export function Chat() {
    const [messages, setMessages] = useSessionStorage<Message[]>('health-copilot-chat-history', []);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatStatus, setChatStatus] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const viewport = useRef<HTMLDivElement>(null);

    useEffect(() => {
        checkChatStatus();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkChatStatus = async () => {
        try {
            const status = await chatApi.getStatus();
            setChatStatus(status);
        } catch (err) {
            console.error('Failed to check chat status:', err);
        }
    };

    const scrollToBottom = () => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await chatApi.sendMessage(input, messages);

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.message,
                timestamp: response.timestamp,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const clearConversation = () => {
        setMessages([]);
    };

    const suggestedQuestions = [
        'How was my sleep last night?',
        'What should I focus on today?',
        'Why is my HRV lower than usual?',
        'Should I work out today?',
    ];

    if (!chatStatus) {
        return (
            <Container size="xl" py="xl">
                <Stack align="center" justify="center" style={{ minHeight: 400 }}>
                    <Loader size="lg" />
                </Stack>
            </Container>
        );
    }

    if (!chatStatus.available) {
        return (
            <Container size="xl" py="xl">
                <Alert icon={<IconAlertCircle size={16} />} title="Chat Unavailable" color="yellow">
                    No AI API key configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in your .env file.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Stack spacing="md" style={{ height: 'calc(100vh - 200px)' }}>
                <Group position="apart">
                    <div>
                        <Title order={1}>Health Chat</Title>
                        <Text size="sm" color="dimmed">
                            Powered by {chatStatus.provider === 'openai' ? 'ChatGPT' : 'Gemini'}
                        </Text>
                    </div>
                    <Button variant="light" size="sm" onClick={clearConversation}>
                        Clear Conversation
                    </Button>
                </Group>

                {messages.length === 0 && (
                    <Paper p="md" withBorder>
                        <Stack spacing="sm">
                            <Text size="sm" color="dimmed">
                                💡 I have access to your current health data. Ask me anything about your metrics!
                            </Text>
                            <Text size="xs" weight={500} color="dimmed">
                                Suggested questions:
                            </Text>
                            <Group spacing="xs">
                                {suggestedQuestions.map((q, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="light"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setInput(q)}
                                    >
                                        {q}
                                    </Badge>
                                ))}
                            </Group>
                        </Stack>
                    </Paper>
                )}

                <ScrollArea style={{ flex: 1 }} viewportRef={viewport}>
                    <Stack spacing="md">
                        {messages.map((msg, idx) => (
                            <Paper
                                key={idx}
                                p="md"
                                withBorder
                                style={{
                                    backgroundColor: msg.role === 'user' ? '#1a1f2e' : '#25262b',
                                    marginLeft: msg.role === 'user' ? 'auto' : 0,
                                    marginRight: msg.role === 'user' ? 0 : 'auto',
                                    maxWidth: '80%',
                                }}
                            >
                                <Group spacing="xs" mb="xs">
                                    {msg.role === 'user' ? (
                                        <IconUser size={16} />
                                    ) : (
                                        <IconRobot size={16} />
                                    )}
                                    <Text size="xs" weight={500}>
                                        {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                    </Text>
                                </Group>
                                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.content}
                                </Text>
                            </Paper>
                        ))}
                        {loading && (
                            <Paper p="md" withBorder style={{ backgroundColor: '#25262b', maxWidth: '80%' }}>
                                <Group spacing="xs">
                                    <Loader size="xs" />
                                    <Text size="sm" color="dimmed">
                                        AI is thinking...
                                    </Text>
                                </Group>
                            </Paper>
                        )}
                    </Stack>
                </ScrollArea>

                {error && (
                    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Group spacing="xs">
                    <TextInput
                        placeholder="Ask about your health data..."
                        value={input}
                        onChange={(e) => setInput(e.currentTarget.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        style={{ flex: 1 }}
                        disabled={loading}
                    />
                    <Button onClick={sendMessage} loading={loading} leftIcon={<IconSend size={16} />}>
                        Send
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
}

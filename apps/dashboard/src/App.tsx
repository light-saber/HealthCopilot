import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppShell, Stack, Group, ThemeIcon, Text, Box } from '@mantine/core';
import {
    IconHome,
    IconMoon,
    IconActivity,
    IconHeart,
    IconMessage,
} from '@tabler/icons-react';
import { Overview } from './pages/Overview';
import { Sleep } from './pages/Sleep';
import { Recovery } from './pages/Recovery';
import { Activity } from './pages/Activity';
import { Chat } from './pages/Chat';

const navItems = [
    { path: '/', label: 'Overview', icon: IconHome },
    { path: '/sleep', label: 'Sleep', icon: IconMoon },
    { path: '/recovery', label: 'Recovery', icon: IconHeart },
    { path: '/activity', label: 'Activity', icon: IconActivity },
    { path: '/chat', label: 'Chat', icon: IconMessage },
];

function App() {
    return (
        <BrowserRouter>
            <AppShell
                padding="md"
                navbar={{
                    width: 280,
                    breakpoint: 'sm',
                }}
                styles={(theme) => ({
                    main: {
                        backgroundColor: theme.colors.dark[8],
                        minHeight: '100vh',
                        paddingTop: 'calc(var(--app-shell-header-offset, 0px) + 20px)',
                    },
                    navbar: {
                        backgroundColor: 'rgba(11, 17, 32, 0.85)', // Semi-transparent dark
                        backdropFilter: 'blur(16px)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                    },
                })}
            >
                <AppShell.Navbar p="md">
                    <Group mb={40} px="xs">
                        <ThemeIcon
                            size={42}
                            radius="xl"
                            variant="gradient"
                            gradient={{ from: 'cyan', to: 'blue' }}
                            style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
                        >
                            <IconHeart size={24} stroke={2.5} />
                        </ThemeIcon>
                        <Box>
                            <Text size="xl" fw={700} style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                                Health Copilot
                            </Text>
                            <Text size="xs" c="dimmed" fw={500}>
                                AI Health Assistant
                            </Text>
                        </Box>
                    </Group>

                    <Stack gap="sm">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '14px 20px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : '#909296',
                                    backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                                    fontWeight: isActive ? 600 : 500,
                                    border: isActive ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid transparent',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'Outfit, sans-serif',
                                })}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={22} stroke={isActive ? 2.5 : 1.5} />
                                        <span style={{ fontSize: '15px' }}>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </Stack>
                </AppShell.Navbar>

                <AppShell.Main>
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/sleep" element={<Sleep />} />
                        <Route path="/recovery" element={<Recovery />} />
                        <Route path="/activity" element={<Activity />} />
                        <Route path="/chat" element={<Chat />} />
                    </Routes>
                </AppShell.Main>
            </AppShell>
        </BrowserRouter>
    );
}

export default App;

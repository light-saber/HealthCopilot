import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppShell, Stack, Group, ThemeIcon, Text, Box, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
    const [opened, { toggle, close }] = useDisclosure();

    return (
        <BrowserRouter>
            <AppShell
                padding="md"
                header={{ height: 60, collapsed: !opened && true }} // Only show header on mobile/when needed? No, usually header is always visible on mobile.
                // Actually, for this design, we want the header VISIBLE on mobile (to show burger) and HIDDEN on desktop (since we have sidebar).
                // Mantine AppShell header collapsed prop: "If set to true, header will be hidden".
                // We want hiddenFrom="sm". But AppShell header config doesn't take hiddenFrom directly in the object usually, 
                // but the AppShell.Header component does.
                // Let's configure the layout first.
                navbar={{
                    width: 280,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}
                styles={{
                    main: {
                        backgroundColor: '#0f1116',
                        minHeight: '100vh',
                        paddingTop: 'calc(var(--app-shell-header-offset, 0px) + 20px)',
                    },
                    navbar: {
                        backgroundColor: '#0f1116',
                        backdropFilter: 'blur(16px)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                    header: {
                        backgroundColor: '#0f1116',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }
                }}
            >
                <AppShell.Header hiddenFrom="sm" px="md">
                    <Group h="100%" align="center">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
                        <Group gap="xs">
                            <ThemeIcon
                                size={28}
                                radius="xl"
                                variant="gradient"
                                gradient={{ from: 'cyan', to: 'blue' }}
                            >
                                <IconHeart size={16} stroke={2.5} />
                            </ThemeIcon>
                            <Text size="lg" fw={700} style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Health Copilot
                            </Text>
                        </Group>
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar p="md">
                    <Group mb={40} px="xs" visibleFrom="sm">
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
                                onClick={close}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '14px 20px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#22d3ee' : '#9ca3af',
                                    backgroundColor: isActive
                                        ? 'rgba(34, 211, 238, 0.1)'
                                        : 'transparent',
                                    fontWeight: isActive ? 600 : 500,
                                    border: isActive
                                        ? '1px solid rgba(34, 211, 238, 0.2)'
                                        : '1px solid transparent',
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

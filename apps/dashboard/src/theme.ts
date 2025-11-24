import { MantineThemeOverride } from '@mantine/core';

/**
 * Custom Mantine theme with dark slate aesthetic and gradient accents
 */
export const theme: MantineThemeOverride = {
    colorScheme: 'dark',
    fontFamily: 'Inter, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
    },

    colors: {
        // Deep Midnight Blue background palette
        dark: [
            '#C1C2C5', // 0
            '#A6A7AB', // 1
            '#909296', // 2
            '#5c5f66', // 3
            '#373A40', // 4
            '#2C2E33', // 5
            '#25262b', // 6
            '#151F32', // 7 - Card background (lighter blue-grey)
            '#0B1120', // 8 - Main background (deep blue-black)
            '#080C16', // 9
        ],
        // Electric Cyan/Blue primary palette
        primary: [
            '#E0F7FA', // 0
            '#B2EBF2', // 1
            '#80DEEA', // 2
            '#4DD0E1', // 3
            '#26C6DA', // 4
            '#00BCD4', // 5 - Cyan
            '#00ACC1', // 6
            '#0097A7', // 7
            '#00838F', // 8
            '#006064', // 9
        ],
    },

    primaryColor: 'primary',
    primaryShade: 5,
    defaultRadius: 'md',

    components: {
        Card: {
            defaultProps: {
                radius: 'lg',
            },
            styles: () => ({
                root: {
                    backgroundColor: 'rgba(21, 31, 50, 0.7)', // Glassmorphism base
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(6, 182, 212, 0.1)', // Glow effect
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                    },
                },
            }),
        },
        Button: {
            defaultProps: {
                radius: 'xl', // Pill shape
                size: 'md',
            },
            styles: () => ({
                root: {
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)', // Primary glow
                    },
                },
            }),
        },
        Paper: {
            styles: () => ({
                root: {
                    backgroundColor: 'rgba(21, 31, 50, 0.7)',
                    backdropFilter: 'blur(12px)',
                },
            }),
        },
        ThemeIcon: {
            defaultProps: {
                radius: 'lg',
            },
        },
    },

    globalStyles: () => ({
        body: {
            backgroundColor: '#0B1120', // Deep midnight blue
            color: '#F8FAFC', // High contrast text
            backgroundImage: 'radial-gradient(circle at 50% 0%, #172a45 0%, #0B1120 100%)', // Subtle top glow
            minHeight: '100vh',
        },
    }),
};

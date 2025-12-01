import { MantineThemeOverride, MantineTheme } from '@mantine/core';

/**
 * Custom Mantine theme with dark slate aesthetic and gradient accents
 */
export const theme: MantineThemeOverride = {
    fontFamily: 'Lato, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
        fontFamily: 'Lato, sans-serif',
        fontWeight: '700',
    },

    colors: {
        // Flat UI Midnight Blue / Wet Asphalt for dark mode backgrounds
        dark: [
            '#ecf0f1', // 0 - Clouds
            '#bdc3c7', // 1 - Silver
            '#95a5a6', // 2 - Concrete
            '#7f8c8d', // 3 - Asbestos
            '#34495e', // 4 - Wet Asphalt
            '#2c3e50', // 5 - Midnight Blue (Primary Background)
            '#22313f', // 6
            '#1a252f', // 7
            '#131b22', // 8
            '#0d1217', // 9
        ],
        // Flat UI Turquoise / Green for primary
        primary: [
            '#d1f2eb', // 0
            '#a3e4d7', // 1
            '#76d7c4', // 2
            '#48c9b0', // 3
            '#1abc9c', // 4 - Turquoise
            '#16a085', // 5 - Green Sea
            '#117a65', // 6
            '#0e6655', // 7
            '#0b5345', // 8
            '#083e34', // 9
        ],
    },

    primaryColor: 'primary',
    primaryShade: 4,
    defaultRadius: 'sm', // Flatter look

    components: {
        Card: {
            defaultProps: {
                radius: 'sm',
                withBorder: false,
            },
            styles: (theme: MantineTheme) => ({
                root: {
                    backgroundColor: theme.colors.dark[4], // Wet Asphalt
                    color: theme.colors.dark[0], // Clouds
                    boxShadow: 'none',
                    border: 'none',
                },
            }),
        },
        Button: {
            defaultProps: {
                radius: 'sm',
                size: 'md',
            },
            styles: (theme: MantineTheme) => ({
                root: {
                    fontWeight: 700,
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                        backgroundColor: theme.colors.primary[5], // Green Sea on hover
                    },
                },
            }),
        },
        Paper: {
            styles: (theme: MantineTheme) => ({
                root: {
                    backgroundColor: theme.colors.dark[4], // Wet Asphalt
                },
            }),
        },
        ThemeIcon: {
            defaultProps: {
                radius: 'sm',
            },
        },
    },


};

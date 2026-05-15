import { Platform } from 'react-native';

export const Colors = {
    light: {
        text: '#1A202C', // Deep Blue-Grey
        background: '#F7FAFC', // Very Light Blue-Grey
        primary: '#3182CE', // Vibrant Blue
        secondary: '#E2E8F0',
        accent: '#4299E1',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        tint: '#3182CE',
        icon: '#718096',
        tabIconDefault: '#A0AEC0',
        tabIconSelected: '#3182CE',
        card: '#FFFFFF',
        error: '#E53E3E',
        success: '#38A169',
        warning: '#DD6B20',
    },
    dark: {
        text: '#F7FAFC',
        background: '#0F172A', // Deep Slate
        primary: '#63B3ED', // Light Blue
        secondary: '#1E293B',
        accent: '#4299E1',
        surface: '#1E293B',
        border: '#334155',
        tint: '#63B3ED',
        icon: '#94A3B8',
        tabIconDefault: '#475569',
        tabIconSelected: '#63B3ED',
        card: '#1E293B',
        error: '#F56565',
        success: '#48BB78',
        warning: '#ED8936',
    },
};

export const Fonts = Platform.select({
    ios: {
        sans: 'system-ui',
        serif: 'ui-serif',
        rounded: 'ui-rounded',
        mono: 'ui-monospace',
    },
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace',
    },
    web: {
        sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        serif: "Georgia, 'Times New Roman', serif",
        rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
        mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
});

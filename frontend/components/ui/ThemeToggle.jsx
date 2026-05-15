import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { Colors } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

export function ThemeToggle({ style }) {
    const { colorScheme, toggleTheme, isDark } = useTheme();
    const themeColors = Colors[colorScheme];

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={[
                styles.button,
                {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border
                },
                style
            ]}
        >
            <IconSymbol
                name={isDark ? "sun.max.fill" : "moon.stars.fill"}
                size={20}
                color={isDark ? "#F1C40F" : "#5D5FEF"}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
});

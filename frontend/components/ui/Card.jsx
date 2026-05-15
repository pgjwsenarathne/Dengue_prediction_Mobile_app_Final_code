import React from 'react';
import {
    View,
    StyleSheet,
    Platform
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Card({ children, style, variant = 'elevated' }) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
                borderWidth: variant === 'outlined' ? 1.5 : 0,
            },
            variant === 'elevated' && styles.elevated,
            style
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        overflow: 'hidden',
    },
    elevated: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});

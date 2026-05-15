import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Button({
    onPress,
    title,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon
}) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return { backgroundColor: themeColors.secondary };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: themeColors.primary
                };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: themeColors.primary };
        }
    };

    const getTextColor = () => {
        if (variant === 'outline' || variant === 'ghost') return themeColors.primary;
        // High contrast logic for black/white buttons
        if (variant === 'secondary') return themeColors.text;
        return colorScheme === 'light' ? '#FFFFFF' : '#000000';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                getButtonStyle(),
                variant === 'outline' && { borderColor: themeColors.border },
                (disabled || loading) && styles.disabled,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[
                        styles.text,
                        { color: getTextColor() },
                        textStyle
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 54,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'transparent',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: -0.2, // Tighter tracking for premium look
    },
    iconContainer: {
        marginRight: 10,
    },
    disabled: {
        opacity: 0.4,
    },
});

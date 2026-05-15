import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Input({
    label,
    error,
    containerStyle,
    icon,
    rightIcon,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: themeColors.surface,
                        borderColor: error ? '#FF4757' : isFocused ? themeColors.primary : themeColors.border,
                    }
                ]}
            >
                {icon}
                <TextInput
                    style={[
                        styles.input,
                        { color: themeColors.text },
                        icon ? { marginLeft: 12 } : {}
                    ]}
                    placeholderTextColor={themeColors.tabIconDefault}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        opacity: 0.8,
    },
    inputContainer: {
        height: 56,
        borderWidth: 1.5,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        fontWeight: '500',
    },
    rightIconContainer: {
        marginLeft: 8,
    },
    errorText: {
        color: '#FF4757',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

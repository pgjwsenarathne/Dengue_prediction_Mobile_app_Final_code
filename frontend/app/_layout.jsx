import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View, StyleSheet } from 'react-native';

import { LanguageProvider } from '@/hooks/LanguageContext';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/hooks/ThemeContext';
import { useNotifications } from '@/hooks/useNotifications';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/constants/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might cause this to error */
});

function RootLayoutContent() {
    const { colorScheme, isDark } = useTheme();
    const [appIsReady, setAppIsReady] = useState(false);
    const { startBackgroundLocationAsync } = useNotifications();
    const themeColors = Colors[colorScheme || 'light'];

    useEffect(() => {
        async function prepare() {
            try {
                // Check and start background tracking if enabled
                const enabled = await SecureStore.getItemAsync('notificationsEnabled');
                if (enabled === 'true') {
                    await startBackgroundLocationAsync();
                }

                // Pre-load fonts or make any API calls you need here
                // We add a small delay to ensure the splash screen is seen and everything is initialized
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn('Error during app preparation:', e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = React.useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately!
            // But we can also call it in useEffect.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <View
                style={[styles.container, { backgroundColor: themeColors.background }]}
                onLayout={onLayoutRootView}
            >
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="report" options={{ headerShown: false }} />
                    <Stack.Screen name="my_reports" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </Stack>
                <StatusBar style={isDark ? 'light' : 'dark'} />
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default function RootLayout() {
    return (
        <AppThemeProvider>
            <LanguageProvider>
                <RootLayoutContent />
            </LanguageProvider>
        </AppThemeProvider>
    );
}



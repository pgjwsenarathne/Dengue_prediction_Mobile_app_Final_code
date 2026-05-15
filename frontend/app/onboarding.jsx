import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Image
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/Button';
import { API_BASE_URL } from '@/constants/api';
import { useTranslation } from '@/hooks/LanguageContext';


const { width, height } = Dimensions.get('window');


export default function OnboardingFlow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t } = useTranslation();

    const ONBOARDING_DATA = [
        {
            title: t('welcome_title'),
            description: t('welcome_desc'),
            image: require('@/assets/logo2.png'),
            color: "#4A90E2"
        },
        {
            title: t('stay_alerted'),
            description: t('stay_alerted_desc'),
            icon: "bell.fill",
            color: "#F1C40F"
        },
        {
            title: t('data_driven'),
            description: t('data_driven_desc'),
            icon: "chart.bar.fill",
            color: "#8A232E"
        },
        {
            title: t('prevention_protection'),
            description: t('prevention_protection_desc'),
            points: [
                "Search and destroy breeding sites weekly",
                "Use repellents and wear long-sleeved clothes",
                "Join community clean-ups (Shramadana)",
                "Seek medical help if fever lasts over 3 days",
                "Use ONLY Paracetamol for fever management"
            ],
            icon: "hand.raised.fill",
            color: "#2ECC71"
        }
    ];


    const handleNext = async () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // End of onboarding, mark as completed in backend
            setLoading(true);
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ is_new_user: false }),
                });

                if (response.ok) {
                    // Update local user info if needed
                    const userInfoStr = await SecureStore.getItemAsync('userInfo');
                    if (userInfoStr) {
                        const userInfo = JSON.parse(userInfoStr);
                        userInfo.is_new_user = false;
                        await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
                    }
                    router.replace('/(tabs)');
                }
            } catch (error) {
                console.error('Onboarding update error:', error);
                router.replace('/(tabs)'); // Fallback
            } finally {
                setLoading(false);
            }
        }
    };

    const currentItem = ONBOARDING_DATA[currentIndex];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
                    <Text style={[styles.skipText, { color: themeColors.icon }]}>{t('skip')}</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.content}>
                <Image 
                    source={require('@/assets/SLlion2.png')}
                    style={styles.backgroundLion}
                    resizeMode="contain"
                />
                <View style={[styles.iconContainer, { backgroundColor: currentItem.color + '20' }]}>
                    {currentItem.image ? (
                        <Image source={currentItem.image} style={styles.imageIcon} resizeMode="contain" />
                    ) : (
                        <IconSymbol name={currentItem.icon} size={80} color={currentItem.color} />
                    )}
                </View>

                <Text style={[styles.title, { color: themeColors.text }]}>{currentItem.title}</Text>
                <Text style={[styles.description, { color: themeColors.icon }]}>
                    {currentItem.description}
                </Text>

                {currentItem.points && (
                    <View style={styles.pointsContainer}>
                        {currentItem.points.map((point, index) => (
                            <View key={index} style={styles.pointItem}>
                                <View style={[styles.bullet, { backgroundColor: currentItem.color }]} />
                                <Text style={[styles.pointText, { color: themeColors.text }]}>{point}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === currentIndex ? themeColors.primary : themeColors.border },
                                index === currentIndex ? { width: 24 } : {}
                            ]}
                        />
                    ))}
                </View>

                <Button
                    title={loading ? t('starting') : (currentIndex === ONBOARDING_DATA.length - 1 ? t('get_started') : t('next'))}
                    onPress={handleNext}
                    disabled={loading}

                    style={styles.button}
                    icon={loading ? <ActivityIndicator color="#fff" size="small" /> : null}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        alignItems: 'flex-end',
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    backgroundLion: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        opacity: 0.08, // Very subtle background logo
    },
    imageIcon: {
        width: 100,
        height: 100,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    pointsContainer: {
        width: '100%',
        marginTop: 8,
        gap: 12,
    },
    pointItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        gap: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    pointText: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
        flex: 1,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 8,
    },
    dot: {
        height: 8,
        width: 8,
        borderRadius: 4,
    },
    button: {
        width: '100%',
    },
});

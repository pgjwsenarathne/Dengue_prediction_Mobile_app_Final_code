import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function PreventionScreen() {
    const { colorScheme } = useTheme();
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t } = useTranslation();

    const preventionTips = [
        {
            title: t('tip1_title'),
            desc: t('tip1_desc'),
            icon: "drop.fill",
            color: "#3498DB"
        },
        {
            title: t('tip2_title'),
            desc: t('tip2_desc'),
            icon: "shield.fill",
            color: "#2ECC71"
        },
        {
            title: t('tip3_title'),
            desc: t('tip3_desc'),
            icon: "tshirt.fill",
            color: "#E67E22"
        },
        {
            title: t('tip4_title'),
            desc: t('tip4_desc'),
            icon: "square.grid.3x3.fill",
            color: "#9B59B6"
        },
        {
            title: t('tip5_title'),
            desc: t('tip5_desc'),
            icon: "bed.double.fill",
            color: "#F1C40F"
        },
        {
            title: t('tip6_title'),
            desc: t('tip6_desc'),
            icon: "person.3.fill",
            color: "#E74C3C"
        }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={themeColors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: themeColors.text }]}>{t('prevention')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={[themeColors.primary, themeColors.primary + 'CC']}
                    style={styles.heroCard}
                >
                    <IconSymbol name="hand.raised.fill" size={60} color="#FFF" />
                    <Text style={styles.heroTitle}>{t('stop_the_spread')}</Text>
                    <Text style={styles.heroSubtitle}>{t('prevention_hero_desc')}</Text>
                </LinearGradient>

                <View style={styles.tipsGrid}>
                    {preventionTips.map((tip, index) => (
                        <Card key={index} style={styles.tipCard}>
                            <View style={[styles.iconContainer, { backgroundColor: tip.color + '20' }]}>
                                <IconSymbol name={tip.icon} size={24} color={tip.color} />
                            </View>
                            <View style={styles.tipText}>
                                <Text style={[styles.tipTitle, { color: themeColors.text }]}>{tip.title}</Text>
                                <Text style={[styles.tipDesc, { color: themeColors.icon }]}>{tip.desc}</Text>
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
    },
    scrollContent: {
        padding: 20,
    },
    heroCard: {
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 15,
    },
    heroSubtitle: {
        color: '#FFF',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.9,
    },
    tipsGrid: {
        gap: 16,
    },
    tipCard: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    tipText: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    tipDesc: {
        fontSize: 13,
        lineHeight: 18,
    }
});

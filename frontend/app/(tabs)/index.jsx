import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/ThemeContext';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LinearGradient } from 'expo-linear-gradient';
import { dashboardStyles as styles } from '@/styles/dashboardStyles';
import { useTranslation } from '@/hooks/LanguageContext';
import { API_BASE_URL } from '@/constants/api';
import * as Location from 'expo-location';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function DashboardScreen() {
    const { colorScheme, isDark } = useTheme();
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t } = useTranslation();

    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const [currentDistrict, setCurrentDistrict] = useState('Locating...');
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userInfoStr = await SecureStore.getItemAsync('userInfo');
                const token = await SecureStore.getItemAsync('userToken');
                
                if (!token) {
                    router.replace('/(auth)/login');
                    return;
                }

                if (userInfoStr) {
                    setUser(JSON.parse(userInfoStr));
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
        setupLocationTracking();
        // Initial global stats fetch while waiting for location
        fetchStats();
    }, []);

    const fetchStats = async (districtName = null) => {
        setStatsLoading(true);
        try {
            const url = districtName ? `${API_BASE_URL}/stats?district=${encodeURIComponent(districtName)}` : `${API_BASE_URL}/stats`;
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setStats(data);
                updateTimestamp();
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const updateTimestamp = () => {
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const setupLocationTracking = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setCurrentDistrict('Permission Denied');
                return;
            }

            // Get initial location
            let location = await Location.getCurrentPositionAsync({});
            updateDistrictName(location.coords.latitude, location.coords.longitude);

            // Watch for changes
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    distanceInterval: 1000, // Update every 1km
                },
                (location) => {
                    updateDistrictName(location.coords.latitude, location.coords.longitude);
                }
            );
        } catch (error) {
            console.error('Location setup error:', error);
        }
    };

    const updateDistrictName = async (lat, lng) => {
        try {
            let geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (geocode.length > 0) {
                const district = geocode[0].subregion || geocode[0].district || geocode[0].city || 'Sri Lanka';
                setCurrentDistrict(district);
                fetchStats(district);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    };

    const handleRefresh = async () => {
        if (currentDistrict && currentDistrict !== 'Locating...' && currentDistrict !== 'Permission Denied') {
            fetchStats(currentDistrict);
        } else {
            fetchStats();
        }
        try {
            let location = await Location.getCurrentPositionAsync({});
            updateDistrictName(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            console.error('Refresh location error:', error);
        }
    };

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
        router.replace('/(auth)/login');
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: themeColors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <StatusBar style="auto" />

            <Image 
                source={isDark ? require('@/assets/SLlion2.png') : require('@/assets/SLlion3.png')}
                style={styles.backgroundLion}
                resizeMode="contain"
            />

            {/* Custom Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: themeColors.icon }]}>{t('hello')}, {user?.name || 'User'}</Text>
                    <Text style={[styles.title, { color: themeColors.text }]}>{t('stay_safe_today')}</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <ThemeToggle />
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/profile')}
                        style={[styles.profileButton, { backgroundColor: themeColors.surface }]}
                    >
                        <IconSymbol name="person.fill" size={24} color={themeColors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Risk Level Card */}
                <Card style={[styles.riskCard, { padding: 0 }]}>
                    <LinearGradient
                        colors={stats?.risk_level === 'High' ? ['#7E1C25', '#C0392B'] : stats?.risk_level === 'Moderate' ? ['#2980B9', '#3498DB'] : ['#27AE60', '#2ECC71']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientBg}
                    />
                    <View style={styles.riskContentWrapper}>
                        <View style={styles.riskHeader}>
                            <View style={styles.riskInfo}>
                                <Text style={styles.riskLabel}>{t('current_risk_level')}</Text>
                                <Text style={styles.riskValue}>
                                    {statsLoading ? '...' : (stats?.risk_level ? t(stats.risk_level.toLowerCase()) : t('moderate'))}
                                </Text>
                            </View>
                            <View style={styles.riskIconContainer}>
                                <IconSymbol name="exclamationmark.shield.fill" size={32} color="#FFF" />
                            </View>
                        </View>
                        <Text style={styles.riskDesc}>
                            {statsLoading ? '...' : (stats?.risk_desc || t('risk_desc'))}
                        </Text>
                    </View>

                    <View style={styles.riskBottomBar}>
                        <View style={styles.locationContainer}>
                            <MaterialIcons name="location-on" size={16} color="#FFF" />
                            <Text style={styles.locationText}>{currentDistrict}</Text>
                        </View>

                        <View style={styles.refreshContainer}>
                            <Text style={styles.updatedText}>Updated: {lastUpdated}</Text>
                            <TouchableOpacity onPress={handleRefresh}>
                                <MaterialIcons name="refresh" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('quick_actions')}</Text>
                    <View style={styles.actionGrid}>
                        <ActionItem
                            icon="doc.text.fill"
                            title={t('report_case')}
                            color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}
                            themeColors={themeColors}
                            onPress={() => router.push('/report')}
                        />
                        <ActionItem
                            icon="chart.bar.fill"
                            title={t('prediction')}
                            color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}
                            themeColors={themeColors}
                            onPress={() => router.push('/(tabs)/prediction')}
                        />
                        <ActionItem
                            icon="hand.raised.fill"
                            title={t('prevention')}
                            color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}
                            themeColors={themeColors}
                            onPress={() => router.push('/prevention')}
                        />
                        <ActionItem
                            icon="bell.fill"
                            title={t('alerts')}
                            color={colorScheme === 'light' ? '#000000' : '#FFFFFF'}
                            themeColors={themeColors}
                            onPress={() => router.push('/alerts')}
                        />
                    </View>
                </View>


                {/* Statistics Section */}
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('area_statistics')}</Text>
                <Card variant="outlined" style={styles.statsCard}>
                    {statsLoading ? (
                        <View style={{ padding: 20 }}>
                            <ActivityIndicator size="small" color={themeColors.primary} />
                        </View>
                    ) : (
                        <View style={styles.statRow}>
                            <StatItem label={t('active_cases')} value={stats?.active_cases?.toString() || "0"} color="#FF4757" />
                            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                            <StatItem label={t('recovered')} value={stats?.recovered?.toString() || "0"} color="#2ECC71" />
                            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                            <StatItem label={t('risk_area')} value={stats?.risk_area || "N/A"} color="#F1C40F" />
                        </View>
                    )}
                </Card>


                {/* Tip of the Day */}
                <Card style={styles.tipCard}>
                    <View style={styles.tipContent}>
                        <IconSymbol name="lightbulb.fill" size={24} color={themeColors.primary} />
                        <View style={styles.tipTextContainer}>
                            <Text style={[styles.tipTitle, { color: themeColors.text }]}>{t('pro_tip')}</Text>
                            <Text style={[styles.tipDesc, { color: themeColors.icon }]}>
                                {t('tip_desc')}
                            </Text>
                        </View>

                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

function ActionItem({ icon, title, color, themeColors, onPress }) {
    return (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
                <IconSymbol name={icon} size={28} color={color} />
            </View>
            <Text style={[styles.actionLabel, { color: themeColors.text }]}>{title}</Text>
        </TouchableOpacity>
    );
}

function StatItem({ label, value, color }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
    );
}



import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/LanguageContext';
import { API_BASE_URL } from '@/constants/api';

export default function AlertsScreen() {
    const { colorScheme } = useTheme();
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t } = useTranslation();

    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAlerts(data);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderAlertItem = ({ item }) => {
        const date = new Date(item.timestamp);
        const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isHighRisk = item.risk_level === 'High';

        return (
            <Card style={[styles.alertCard, { borderLeftColor: isHighRisk ? '#FF4757' : '#2ECC71', borderLeftWidth: 5 }]}>
                <View style={styles.alertHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: isHighRisk ? '#FF475720' : '#2ECC7120' }]}>
                        <Text style={[styles.statusText, { color: isHighRisk ? '#FF4757' : '#2ECC71' }]}>
                            {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
                        </Text>
                    </View>
                    <Text style={[styles.dateText, { color: themeColors.icon }]}>{dateString}</Text>
                </View>
                <Text style={[styles.alertTitle, { color: themeColors.text }]}>
                    Dengue Prediction Alert
                </Text>
                <Text style={[styles.alertBody, { color: themeColors.icon }]}>
                    Environmental data indicates an estimated {item.predicted_cases} cases in this area.
                </Text>
                <View style={styles.alertFooter}>
                    <Text style={[styles.footerText, { color: themeColors.icon }]}>
                        Temp: {item.temp}°C | Humidity: {item.humidity}%
                    </Text>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={28} color={themeColors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: themeColors.text }]}>{t('alerts')}</Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={themeColors.primary} />
                </View>
            ) : (
                <FlatList
                    data={alerts}
                    renderItem={renderAlertItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <IconSymbol name="bell.slash.fill" size={60} color={themeColors.icon} />
                            <Text style={[styles.emptyText, { color: themeColors.icon }]}>No recent alerts</Text>
                        </View>
                    }
                />
            )}
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    alertCard: {
        padding: 16,
        marginBottom: 16,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
    },
    dateText: {
        fontSize: 12,
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
    },
    alertBody: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    alertFooter: {
        borderTopWidth: 1,
        borderTopColor: '#00000010',
        paddingTop: 10,
    },
    footerText: {
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 15,
    }
});

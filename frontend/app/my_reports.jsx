import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Dimensions
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

export default function MyReportsScreen() {
    const { colorScheme } = useTheme();
    const themeColors = Colors[colorScheme];
    const router = useRouter();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReports = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await fetch(`${API_BASE_URL}/my_reports`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setReports(data);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchReports();
    };

    const renderItem = ({ item }) => (
        <Card style={styles.reportCard}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={[styles.patientName, { color: themeColors.text }]}>{item.name}</Text>
                    <Text style={[styles.reportDate, { color: themeColors.icon }]}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'} at {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: themeColors.primary + '20' }]}>
                    <Text style={[styles.statusText, { color: themeColors.primary }]}>{item.status || 'Reported'}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <IconSymbol name="mappin.and.ellipse" size={16} color={themeColors.icon} />
                    <Text style={[styles.infoText, { color: themeColors.text }]}>{item.district}</Text>
                </View>
                <View style={styles.infoRow}>
                    <IconSymbol name="person.fill" size={16} color={themeColors.icon} />
                    <Text style={[styles.infoText, { color: themeColors.text }]}>{item.age} years • {item.gender}</Text>
                </View>
                {item.symptoms ? (
                    <View style={styles.symptomsContainer}>
                        <Text style={[styles.symptomsLabel, { color: themeColors.icon }]}>Symptoms:</Text>
                        <Text style={[styles.symptomsText, { color: themeColors.text }]} numberOfLines={2}>
                            {item.symptoms}
                        </Text>
                    </View>
                ) : null}
            </View>

            {/* Displaying the image from Base64 or URL */}
            {item.image_base64 ? (
                <Image 
                    source={{ uri: item.image_base64 }} 
                    style={styles.reportImage}
                    resizeMode="cover"
                />
            ) : item.image_url ? (
                <Image 
                    source={{ uri: `${API_BASE_URL}${item.image_url}` }} 
                    style={styles.reportImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.noImage, { backgroundColor: themeColors.background }]}>
                    <IconSymbol name="photo" size={32} color={themeColors.icon} />
                    <Text style={{ color: themeColors.icon }}>No image provided</Text>
                </View>
            )}
        </Card>
    );

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Stack.Screen 
                options={{ 
                    title: 'My Reported Cases', 
                    headerShown: true,
                    headerTintColor: themeColors.text,
                    headerStyle: { backgroundColor: themeColors.background }
                }} 
            />
            
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={themeColors.primary} />
                </View>
            ) : reports.length === 0 ? (
                <View style={styles.centerContainer}>
                    <IconSymbol name="doc.text.magnifyingglass" size={64} color={themeColors.icon} />
                    <Text style={[styles.emptyText, { color: themeColors.text }]}>No reports found</Text>
                    <TouchableOpacity 
                        style={[styles.reportButton, { backgroundColor: themeColors.primary }]}
                        onPress={() => router.push('/report')}
                    >
                        <Text style={styles.reportButtonText}>Report a Case</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={reports}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    listContent: {
        padding: 20,
    },
    reportCard: {
        marginBottom: 20,
        padding: 0,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '700',
    },
    reportDate: {
        fontSize: 12,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
    },
    symptomsContainer: {
        marginTop: 4,
    },
    symptomsLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    symptomsText: {
        fontSize: 13,
        fontStyle: 'italic',
    },
    reportImage: {
        width: '100%',
        height: 200,
    },
    noImage: {
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 24,
    },
    reportButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    reportButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    }
});

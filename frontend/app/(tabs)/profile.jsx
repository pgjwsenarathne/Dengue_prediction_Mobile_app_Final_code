import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/constants/api';
import { useTranslation } from '@/hooks/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t, lang, changeLanguage } = useTranslation();
    const { registerForPushNotificationsAsync, scheduleDailyAlert, stopBackgroundLocationAsync } = useNotifications();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [notificationTime, setNotificationTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        fetchProfile();
        loadNotificationPrefs();
    }, []);

    const loadNotificationPrefs = async () => {
        try {
            const enabled = await SecureStore.getItemAsync('notificationsEnabled');
            const time = await SecureStore.getItemAsync('notificationTime');
            if (enabled !== null) {
                const isEnabled = enabled === 'true';
                setNotificationsEnabled(isEnabled);
                if (isEnabled && time) {
                    const [h, m] = time.split(':');
                    scheduleDailyAlert(parseInt(h), parseInt(m));
                    registerForPushNotificationsAsync();
                }
            }
            if (time !== null) {
                const [hours, minutes] = time.split(':');
                const d = new Date();
                d.setHours(parseInt(hours), parseInt(minutes), 0);
                setNotificationTime(d);
            }
        } catch (error) {
            console.error('Error loading notification prefs:', error);
        }
    };

    const saveNotificationPrefs = async (enabled, time) => {
        try {
            const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
            await SecureStore.setItemAsync('notificationsEnabled', String(enabled));
            await SecureStore.setItemAsync('notificationTime', timeStr);
            
            if (enabled) {
                await scheduleDailyAlert(time.getHours(), time.getMinutes());
                await registerForPushNotificationsAsync();
            } else {
                await Notifications.cancelAllScheduledNotificationsAsync();
                await stopBackgroundLocationAsync();
            }
            
            Alert.alert('Success', 'Notification preferences saved');
        } catch (error) {
            Alert.alert('Error', 'Failed to save preferences');
        }
    };

    const onTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || notificationTime;
        setShowTimePicker(Platform.OS === 'ios');
        setNotificationTime(currentDate);
        if (event.type === 'set' || Platform.OS === 'ios') {
            saveNotificationPrefs(notificationsEnabled, currentDate);
        }
    };

    const fetchProfile = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                router.replace('/(auth)/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setName(data.name);
                setEmail(data.email);
            } else {
                Alert.alert('Error', 'Could not load profile');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!name) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setUpdating(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully');
                // Update local storage
                const userInfoStr = await SecureStore.getItemAsync('userInfo');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    userInfo.name = name;
                    await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
                }
            } else {
                Alert.alert('Error', 'Update failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to server');
        } finally {
            setUpdating(false);
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
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: themeColors.background }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.avatarCircle, { backgroundColor: themeColors.primary + '20' }]}>
                        <IconSymbol name="person.fill" size={60} color={themeColors.primary} />
                    </View>
                    <Text style={[styles.userName, { color: themeColors.text }]}>{name}</Text>
                    <Text style={[styles.userEmail, { color: themeColors.icon }]}>{email}</Text>
                </View>

                <Card style={styles.formCard}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{t('edit_details')}</Text>
                    <Input
                        label={t('name')}
                        placeholder="Your Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        label={t('email')}
                        value={email}
                        editable={false}
                        containerStyle={{ opacity: 0.7 }}
                    />
                    
                    <Button
                        title={updating ? "Updating..." : t('save_changes')}
                        onPress={handleUpdate}
                        disabled={updating}
                        style={styles.saveButton}
                    />
                </Card>

                <View style={styles.actionsContainer}>
                    <View style={styles.sectionHeaderRow}>
                         <Text style={[styles.sectionTitleSmall, { color: themeColors.text }]}>{t('language')}</Text>
                    </View>
                    
                    <View style={styles.languageToggleContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.languageButton, 
                                { 
                                    backgroundColor: lang === 'en' ? themeColors.primary : themeColors.surface, 
                                    borderColor: themeColors.border 
                                }
                            ]}
                            onPress={() => changeLanguage('en')}
                        >
                            <Text style={[
                                styles.languageButtonText, 
                                { color: lang === 'en' ? (colorScheme === 'light' ? '#FFF' : '#000') : themeColors.text }
                            ]}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.languageButton, 
                                { 
                                    backgroundColor: lang === 'si' ? themeColors.primary : themeColors.surface, 
                                    borderColor: themeColors.border 
                                }
                            ]}
                            onPress={() => changeLanguage('si')}
                        >
                            <Text style={[
                                styles.languageButtonText, 
                                { color: lang === 'si' ? (colorScheme === 'light' ? '#FFF' : '#000') : themeColors.text }
                            ]}>සිංහල</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.sectionTitleSmall, { color: themeColors.text, marginTop: 16 }]}>Settings</Text>

                    <TouchableOpacity 
                        style={styles.actionRow}
                        onPress={() => router.push('/my_reports')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                            <IconSymbol name="doc.text.fill" size={20} color={themeColors.primary} />
                        </View>
                        <Text style={[styles.actionText, { color: themeColors.text }]}>My Reported Cases</Text>
                        <IconSymbol name="chevron.right" size={20} color={themeColors.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionRow}>
                        <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                            <IconSymbol name="shield.fill" size={20} color="#2ECC71" />
                        </View>
                        <Text style={[styles.actionText, { color: themeColors.text }]}>{t('privacy_settings')}</Text>
                        <IconSymbol name="chevron.right" size={20} color={themeColors.icon} />
                    </TouchableOpacity>


                    <Card style={[styles.notificationCard, { backgroundColor: themeColors.surface }]}>
                        <View style={styles.notificationHeader}>
                            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                                <IconSymbol name="bell.fill" size={20} color="#F39C12" />
                            </View>
                            <Text style={[styles.actionText, { color: themeColors.text }]}>{t('notification_prefs')}</Text>
                            <TouchableOpacity 
                                onPress={() => {
                                    const newVal = !notificationsEnabled;
                                    setNotificationsEnabled(newVal);
                                    saveNotificationPrefs(newVal, notificationTime);
                                }}
                            >
                                <View style={[
                                    styles.toggleBackground, 
                                    { backgroundColor: notificationsEnabled ? themeColors.primary : themeColors.icon + '40' }
                                ]}>
                                    <View style={[
                                        styles.toggleCircle, 
                                        { transform: [{ translateX: notificationsEnabled ? 20 : 0 }] }
                                    ]} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {notificationsEnabled && (
                            <View style={styles.timeSelectionContainer}>
                                <Text style={[styles.timeLabel, { color: themeColors.icon }]}>Alert Time</Text>
                                <View style={styles.timePickerRow}>
                                    <TouchableOpacity 
                                        style={[styles.timeChip, { backgroundColor: themeColors.primary + '15' }]}
                                        onPress={() => setShowTimePicker(true)}
                                    >
                                        <Text style={[styles.timeText, { color: themeColors.primary }]}>
                                            {notificationTime.getHours().toString().padStart(2, '0')}:{notificationTime.getMinutes().toString().padStart(2, '0')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={notificationTime}
                                        mode="time"
                                        is24Hour={true}
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onTimeChange}
                                    />
                                )}
                                <Text style={styles.timeHelper}>You will receive danger area alerts at this time.</Text>
                            </View>
                        )}
                    </Card>


                    <TouchableOpacity 
                        style={[styles.actionRow, styles.logoutRow]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
                            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FF4757" />
                        </View>
                        <Text style={[styles.actionText, { color: '#FF4757' }]}>{t('sign_out')}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        fontWeight: '500',
    },
    formCard: {
        padding: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    saveButton: {
        marginTop: 8,
    },
    actionsContainer: {
        gap: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    logoutRow: {
        marginTop: 12,
    },
    sectionTitleSmall: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    languageToggleContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    languageButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    notificationCard: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleBackground: {
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 4,
        justifyContent: 'center',
    },
    toggleCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    timeSelectionContainer: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    timePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    timeChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    timeText: {
        fontSize: 20,
        fontWeight: '700',
    },
    timeHelper: {
        fontSize: 12,
        color: '#95A5A6',
        fontStyle: 'italic',
    }
});


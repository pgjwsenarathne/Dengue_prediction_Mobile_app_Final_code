import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { API_BASE_URL } from '@/constants/api';
import { useTranslation } from '@/hooks/LanguageContext';


export default function PredictionScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { t } = useTranslation();


    const [temp, setTemp] = useState('');
    const [precip, setPrecip] = useState('');
    const [humidity, setHumidity] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handlePredict = async () => {
        if (!temp || !precip || !humidity) {
            Alert.alert('Error', 'Please enter all environmental data.');
            return;
        }

        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                Alert.alert('Error', 'No authentication token found. Please log in again.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    Temp_avg: parseFloat(temp),
                    Precipitation_avg: parseFloat(precip),
                    Humidity_avg: parseFloat(humidity)
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                Alert.alert('Prediction Failed', data.message || 'Error occurred');
            }
        } catch (error) {
            console.error('Prediction error:', error);
            Alert.alert('Error', 'Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.background }}>
            <ThemeToggle style={styles.floatingToggle} />
            <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
                <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.text }]}>{t('prediction_title')}</Text>
                <Text style={[styles.subtitle, { color: themeColors.icon }]}>
                    {t('prediction_subtitle')}
                </Text>
            </View>


            <View style={styles.form}>
                <Input
                    label={t('temp')}
                    placeholder="e.g. 28.5"
                    keyboardType="numeric"
                    value={temp}
                    onChangeText={setTemp}
                />
                <Input
                    label={t('precip')}
                    placeholder="e.g. 120.0"
                    keyboardType="numeric"
                    value={precip}
                    onChangeText={setPrecip}
                />
                <Input
                    label={t('humidity')}
                    placeholder="e.g. 75.0"
                    keyboardType="numeric"
                    value={humidity}
                    onChangeText={setHumidity}
                />

                <Button
                    title={loading ? t('calculating') : t('get_prediction')}
                    onPress={handlePredict}
                    disabled={loading}
                    style={styles.predictButton}
                />
            </View>


            {loading && <ActivityIndicator size="large" color={themeColors.primary} style={styles.loader} />}

            {result && (
                <Card style={[styles.resultCard, { borderColor: result.risk_level === 'High' ? '#FF4757' : '#2ECC71', borderLeftWidth: 8 }]}>
                    <Text style={[styles.resultLabel, { color: themeColors.icon }]}>{t('predicted_risk')}</Text>
                    <Text style={[styles.resultValue, { color: result.risk_level === 'High' ? '#FF4757' : '#2ECC71' }]}>
                        {result.risk_level === 'High' ? t('high') : t('low')}
                    </Text>
                    <Text style={[styles.resultDetail, { color: themeColors.text }]}>
                        {t('estimated_cases')} {result.predicted_cases}
                    </Text>
                </Card>
            )}

        </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
    },
    form: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    predictButton: {
        marginTop: 8,
    },
    loader: {
        marginBottom: 32,
    },
    resultCard: {
        marginHorizontal: 24,
        marginBottom: 40,
        padding: 24,
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 12,
    },
    resultDetail: {
        fontSize: 16,
        lineHeight: 24,
    },
    floatingToggle: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 100,
    }
});

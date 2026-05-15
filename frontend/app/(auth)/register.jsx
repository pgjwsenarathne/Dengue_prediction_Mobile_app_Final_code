import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/constants/api';
import { authStyles as styles } from '@/styles/authStyles';
import { useTranslation } from '@/hooks/LanguageContext';
import { useTheme } from '@/hooks/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function RegisterScreen() {
    const { colorScheme, isDark } = useTheme();
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t, lang, changeLanguage } = useTranslation();


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const cleanBaseUrl = API_BASE_URL;
            console.log(`Attempting registration to: ${cleanBaseUrl}/register`);
            let response = await fetch(`${cleanBaseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            // Handle potential 404 by trying /api/register
            if (response.status === 404) {
                const retryResponse = await fetch(`${cleanBaseUrl}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });
                if (retryResponse.ok || retryResponse.status !== 404) {
                    response = retryResponse;
                }
            }

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Registration non-JSON response:', responseText);
                const preview = responseText.length > 100 ? responseText.substring(0, 100) + '...' : responseText;
                Alert.alert(
                    'Server Error',
                    `The server (Status ${response.status}) returned invalid data.\n\n` +
                    `Response: "${preview}"`
                );
                return;
            }

            if (response.ok) {
                Alert.alert('Success', 'Account created successfully! Please log in.', [
                    { text: 'OK', onPress: () => router.push('/(auth)/login') }
                ]);
            } else {
                Alert.alert('Registration Failed', data.message || 'Could not register');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', `Could not connect to the server: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: isDark ? themeColors.background : '#FFFFFF' }]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* 1. Header with Curved Background */}
                <View style={[styles.headerBackground, { height: 280 }, isDark && { backgroundColor: themeColors.surface }]}>
                    <View style={styles.topActionsContainer}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.langSelectorNative}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={isDark ? themeColors.text : '#1A202C'} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <ThemeToggle style={styles.loginThemeToggle} />
                            <TouchableOpacity
                                onPress={() => changeLanguage(lang === 'en' ? 'si' : 'en')}
                                style={styles.langSelectorNative}
                            >
                                <Image source={require('@/assets/SLflag.png')} style={styles.slMiniFlag} />
                                <Text style={[styles.langText, { color: isDark ? themeColors.text : '#1A202C' }]}>
                                    {lang === 'en' ? 'සිංහල' : 'English'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.logoContainer}>
                        <Image
                            source={isDark ? require('@/assets/logo4.png') : require('@/assets/logo3.png')}
                            style={[styles.shieldLogo, { width: 70, height: 70 }]}
                            resizeMode="contain"
                        />
                        <Text style={[styles.brandName, { fontSize: 24 }]}>
                            Dengue<Text style={styles.brandNameRed}>Shield</Text>
                        </Text>
                        <Text style={[styles.brandMission, { marginTop: 0 }]}>{t('create_account')}</Text>
                    </View>
                </View>

                {/* 2. Form Section */}
                <View style={styles.formContainer}>
                    <Input
                        placeholder={t('name')}
                        value={name}
                        onChangeText={setName}
                        icon={<MaterialIcons name="person" size={20} color="#718096" style={styles.inputIcon} />}
                    />

                    <Input
                        placeholder={t('email')}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        icon={<MaterialIcons name="email" size={20} color="#718096" style={styles.inputIcon} />}
                    />

                    <Input
                        placeholder={t('password')}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        icon={<MaterialIcons name="lock" size={20} color="#718096" style={styles.inputIcon} />}
                        rightIcon={
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#718096" />
                            </TouchableOpacity>
                        }
                    />

                    <Input
                        placeholder={t('confirm_password')}
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        icon={<MaterialIcons name="lock-outline" size={20} color="#718096" style={styles.inputIcon} />}
                    />

                    <TouchableOpacity
                        style={[styles.loginButton, { marginTop: 10 }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <MaterialIcons name="person-add" size={22} color="#FFF" />
                                <Text style={styles.loginButtonText}>{t('signup')}</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footerLinks}>
                        <Text style={styles.noAccountText}>
                            {t('already_have_account')}{' '}
                            <Link href="/(auth)/login" asChild>
                                <Text style={styles.signUpLink}>{t('login')}</Text>
                            </Link>
                        </Text>
                    </View>
                </View>

                {/* 3. Footer */}
                <View style={styles.footer}>
                    <Image
                        source={require('@/assets/logo4.png')}
                        style={styles.slEmblem}
                        resizeMode="contain"
                    />
                    <Text style={styles.footerTextMain}>Dengue Shield</Text>
                    <Text style={styles.footerTextSub}>Together Against Dengue</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

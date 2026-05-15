import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/constants/api';
import { authStyles as styles } from '@/styles/authStyles';
import { useTranslation } from '@/hooks/LanguageContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/hooks/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { colorScheme, isDark } = useTheme();
    const themeColors = Colors[colorScheme];
    const router = useRouter();
    const { t, lang, changeLanguage } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Google Auth Request
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '734514045592-p5cj69udnjhn4382h5uoj5j9q2use3np.apps.googleusercontent.com',
        webClientId: '734514045592-m9p44jhei0h6i3ra723avjm1sburatkb.apps.googleusercontent.com',
        useProxy: true,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleLogin(id_token);
        }
    }, [response]);

    const handleGoogleLogin = async (idToken) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_token: idToken }),
            });

            const responseText = await res.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Non-JSON response:', responseText);
                Alert.alert('Server Error', `Invalid response (Status ${res.status}). The server might be starting up or the path is incorrect.`);
                return;
            }

            if (res.ok) {
                await SecureStore.setItemAsync('userToken', data.access_token);
                await SecureStore.setItemAsync('userInfo', JSON.stringify(data.user));
                router.replace(data.user?.is_new_user ? '/onboarding' : '/(tabs)');
            } else {
                Alert.alert('Google Login Failed', data.message || 'Verification error');
            }
        } catch (error) {
            console.error('Google login error:', error);
            Alert.alert('Connection Error', `Could not connect to backend server: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const cleanBaseUrl = API_BASE_URL.trim().replace(/\/+$/, '');
            console.log(`Attempting login to: ${cleanBaseUrl}/login`);

            // Step 1: Try the primary login endpoint
            let response = await fetch(`${cleanBaseUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            // If 404, maybe it needs a trailing slash or /api prefix
            if (response.status === 404) {
                console.log('404 detected, trying /api/login...');
                const retryResponse = await fetch(`${cleanBaseUrl}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
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
                console.error('Server returned non-JSON:', responseText);
                // This is the "Proper Fix" for the Unexpected Character error.
                // We show the status and the first 100 characters of the response.
                const preview = responseText.length > 100 ? responseText.substring(0, 100) + '...' : responseText;
                Alert.alert(
                    'Server Error',
                    `The server responded with status ${response.status} but it wasn't valid data.\n\n` +
                    `Response: "${preview}"\n\n` +
                    `Tip: If this is Render.com, the server might be waking up. Try again in 30 seconds.`
                );
                return;
            }

            if (response.ok) {
                await SecureStore.setItemAsync('userToken', data.access_token);
                await SecureStore.setItemAsync('userInfo', JSON.stringify(data.user));
                router.replace(data.user?.is_new_user ? '/onboarding' : '/(tabs)');
            } else {
                Alert.alert('Login Failed', data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Network request failed:', error);
            Alert.alert(
                'Connection Error',
                `Network request failed: ${error.message}.\n\n` +
                `Please check your internet connection or if the backend URL is correct.`
            );
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
                <View style={[styles.headerBackground, isDark && { backgroundColor: themeColors.surface }]}>
                    <Image
                        source={isDark ? require('@/assets/login_background2.png') : require('@/assets/login_background.jpg')}
                        style={styles.headerBackgroundImage}
                        resizeMode="cover"
                    />
                    <View style={styles.topActionsContainer}>
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

                    <View style={styles.logoContainer}>
                        <Image
                            source={isDark ? require('@/assets/logo4.png') : require('@/assets/logo3.png')}
                            style={styles.shieldLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.brandName}>
                            Dengu<Text style={styles.brandNameRed}>Shield</Text>
                        </Text>
                        <Text style={[styles.brandSlogan, isDark && { color: themeColors.text }]}>Stay Alert. Stay Safe.</Text>
                        <Text style={styles.brandMission}>Together Against Dengue.</Text>
                    </View>

                </View>

                {/* 2. Form Section */}
                <View style={styles.formContainer}>
                    <Text style={[styles.welcomeTitle, isDark && { color: themeColors.text }]}>{t('welcome_back')}!</Text>
                    <Text style={styles.loginSubtitle}>{t('login_subtitle')}</Text>

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

                    <View style={styles.rememberContainer}>
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View style={[styles.checkbox, rememberMe && { backgroundColor: '#004D40' }]}>
                                {rememberMe && <MaterialIcons name="check" size={14} color="#FFF" />}
                            </View>
                            <Text style={[styles.checkboxLabel, isDark && { color: themeColors.icon }]}>Remember me</Text>
                        </TouchableOpacity>

                        <TouchableOpacity>
                            <Text style={styles.forgotText}>{t('forgot_password')}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <MaterialIcons name="login" size={22} color="#FFF" />
                                <Text style={styles.loginButtonText}>{t('login')}</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footerLinks}>
                        <Text style={styles.noAccountText}>
                            {t('no_account')}{' '}
                            <Link href="/(auth)/register" asChild>
                                <Text style={styles.signUpLink}>{t('signup')}</Text>
                            </Link>
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{ marginTop: 20, alignItems: 'center', padding: 10 }}
                        onPress={async () => {
                            // THE ABSOLUTE TRUTH - NO MORE HIDDEN CHARACTERS
                            const cleanUrl = API_BASE_URL;

                            try {
                                const res = await fetch(`${cleanUrl}/ping`, {
                                    method: 'GET',
                                    headers: { 'Accept': 'application/json' }
                                });
                                const text = await res.text();

                                try {
                                    const data = JSON.parse(text);
                                    Alert.alert('Server Status', `✅ SUCCESS!\n\nStatus: ${res.status}\nMessage: ${data.message}\nDB: ${data.db_status ? 'CONNECTED' : 'OFFLINE'}`);
                                } catch (e) {
                                    Alert.alert('Server Status', `⚠️ PARTIAL SUCCESS\n\nStatus: ${res.status}\nServer responded but not with JSON. This means Render is working but the code has an error.\n\nResponse: "${text.substring(0, 100)}"`);
                                }
                            } catch (e) {
                                Alert.alert('Server Status', `❌ FAILED\n\nError: ${e.message}\nURL: ${cleanUrl}\n\nTip: Make sure your phone has internet.`);
                            }
                        }}
                    >
                        <Text style={{ color: '#718096', fontSize: 13, textDecorationLine: 'underline', fontWeight: '600' }}>Check Server Status (Final Fix v3)</Text>
                    </TouchableOpacity>
                </View>

                {/* 3. Footer with National Emblem */}
                <View style={styles.footer}>
                    <Image
                        source={require('@/assets/logo4.png')}
                        style={styles.slEmblem}
                        resizeMode="contain"
                    />
                    <Text style={styles.footerTextMain}>Dengue Shield</Text>
                    <Text style={styles.footerTextSub}>Working towards a Dengue Free Sri Lanka</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

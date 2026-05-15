import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Image
                source={require('@/assets/SLlion.png')}
                style={styles.slLion}
                resizeMode="contain"
            />
            <Image
                source={require('@/assets/SLlogo.png')}
                style={styles.slLogo}
                resizeMode="contain"
            />
            <View style={styles.imageSection}>
                <LinearGradient
                    colors={['#FFFFFF', '#F0F2F5']}
                    style={styles.gradient}
                />
                <Image
                    source={require('@/assets/loading_image.jpg')}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />
                <Image
                    source={require('@/assets/logo3.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.contentSection}>
                <Text style={[styles.title, { color: themeColors.text }]}>
                    Beat Dengue with AI
                </Text>
                <Text style={[styles.description, { color: themeColors.icon }]}>
                    Predict risk levels, report cases, and receive real-time alerts to keep your community safe.
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Get Started"
                        onPress={() => router.push('/(auth)/login')}
                        style={styles.button}
                    />
                    <Button
                        variant="outline"
                        title="Learn More"
                        onPress={() => { }}
                        style={styles.button}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slLogo: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 60,
        height: 60,
        zIndex: 10,
    },
    slLion: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 60,
        height: 60,
        zIndex: 10,
    },
    imageSection: {
        height: height * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        overflow: 'hidden',
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.2, // Subtle background to keep the main logo prominent
    },
    logo: {
        width: width * 0.8,
        height: width * 0.7,
    },
    contentSection: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        width: '100%',
    },
});

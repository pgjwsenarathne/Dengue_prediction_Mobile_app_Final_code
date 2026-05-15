import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';

export default function ReportCaseScreen() {
    const { colorScheme } = useTheme();
    const themeColors = Colors[colorScheme];
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        age: '',
        gender: '',
        district: '',
        symptoms: '',
        contact: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.district || !form.contact) {
            Alert.alert('Error', 'Please fill in all required fields (Name, District, Contact)');
            return;
        }

        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('age', form.age);
            formData.append('gender', form.gender);
            formData.append('district', form.district);
            formData.append('symptoms', form.symptoms);
            formData.append('contact', form.contact);

            if (image) {
                const uriParts = image.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                
                formData.append('image', {
                    uri: image.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
            }

            const response = await fetch(`${API_BASE_URL}/report_case`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseText = await response.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse response as JSON:', responseText);
                throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
            }

            if (response.ok) {
                Alert.alert('Success', 'Case reported successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error', result.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Submission error:', error);
            Alert.alert('Error', 'Failed to submit the report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Stack.Screen 
                options={{ 
                    headerShown: true, 
                    title: 'Report Dengue Case',
                    headerTransparent: true,
                    headerTintColor: themeColors.text,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
                        </TouchableOpacity>
                    )
                }} 
            />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.headerSpacer} />
                    
                    <Text style={[styles.subtitle, { color: themeColors.icon }]}>
                        Provide patient details to help health authorities track and manage outbreaks.
                    </Text>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: themeColors.text }]}>Patient Name *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border }]}
                                placeholder="Enter patient name"
                                placeholderTextColor={themeColors.icon}
                                value={form.name}
                                onChangeText={(text) => setForm({...form, name: text})}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={[styles.label, { color: themeColors.text }]}>Age</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border }]}
                                    placeholder="Age"
                                    keyboardType="numeric"
                                    placeholderTextColor={themeColors.icon}
                                    value={form.age}
                                    onChangeText={(text) => setForm({...form, age: text})}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={[styles.label, { color: themeColors.text }]}>Gender</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border }]}
                                    placeholder="M / F"
                                    placeholderTextColor={themeColors.icon}
                                    value={form.gender}
                                    onChangeText={(text) => setForm({...form, gender: text})}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: themeColors.text }]}>District *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border }]}
                                placeholder="E.g. Colombo"
                                placeholderTextColor={themeColors.icon}
                                value={form.district}
                                onChangeText={(text) => setForm({...form, district: text})}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: themeColors.text }]}>Contact Number *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border }]}
                                placeholder="Enter contact number"
                                keyboardType="phone-pad"
                                placeholderTextColor={themeColors.icon}
                                value={form.contact}
                                onChangeText={(text) => setForm({...form, contact: text})}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: themeColors.text }]}>Symptoms & Observations</Text>
                            <TextInput
                                style={[styles.textArea, { backgroundColor: themeColors.surface, color: themeColors.text, borderColor: themeColors.border }]}
                                placeholder="High fever, rashes, joint pain etc."
                                placeholderTextColor={themeColors.icon}
                                multiline
                                numberOfLines={4}
                                value={form.symptoms}
                                onChangeText={(text) => setForm({...form, symptoms: text})}
                            />
                        </View>

                        <View style={styles.imageSection}>
                            <Text style={[styles.label, { color: themeColors.text }]}>Patient / Medical Report Image</Text>
                            <TouchableOpacity 
                                style={[styles.imagePicker, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]} 
                                onPress={pickImage}
                            >
                                {image ? (
                                    <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <IconSymbol name="camera.fill" size={32} color={themeColors.primary} />
                                        <Text style={{ color: themeColors.icon, marginTop: 8 }}>Tap to upload photo</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={[styles.submitButton, loading && { opacity: 0.7 }]} 
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[themeColors.primary, themeColors.accent]}
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="#FFF" size="small" />
                                        <Text style={[styles.submitText, { marginLeft: 10 }]}>Submitting...</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.submitText}>Submit Report</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    headerSpacer: {
        height: 80,
    },
    backButton: {
        padding: 8,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    formContainer: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    imageSection: {
        gap: 8,
        marginTop: 8,
    },
    imagePicker: {
        height: 180,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    submitButton: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    gradient: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import MapView, { Heatmap, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/ThemeContext';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { exploreStyles as styles } from '@/styles/exploreStyles';
import { API_BASE_URL } from '@/constants/api';

const darkMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
    { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

export default function ExploreScreen() {
    const { colorScheme, toggleTheme, isDark } = useTheme();
    const themeColors = Colors[colorScheme];
    const [location, setLocation] = useState(null);

    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                } else {
                    let loc = await Location.getCurrentPositionAsync({});
                    setLocation(loc);
                }
            } catch (err) {
                console.warn("Location error:", err);
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/heatmap`);
                const data = await response.json();
                
                // Format data for React Native Maps Heatmap
                const formattedData = data.map(point => ({
                    latitude: parseFloat(point.lat),
                    longitude: parseFloat(point.lng),
                    weight: parseFloat(point.weight) * 10, // Scale weight for visibility
                    district: point.district,
                    cases: point.cases
                }));
                
                setHeatmapData(formattedData);
            } catch (err) {
                console.error("Error fetching heatmap data:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const initialRegion = {
        latitude: 7.8731, // Center of Sri Lanka
        longitude: 80.7718,
        latitudeDelta: 4.5,
        longitudeDelta: 4.5,
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: themeColors.text }]}>Global Risk Map</Text>
                    <Text style={[styles.subtitle, { color: themeColors.icon }]}>Live Dengue Monitoring</Text>
                </View>
                <View style={styles.headerActions}>
                    <ThemeToggle />
                    <TouchableOpacity style={[styles.filterButton, { backgroundColor: themeColors.surface }]}>
                        <IconSymbol name="chevron.right" size={20} color={themeColors.text} />
                        <Text style={[styles.filterText, { color: themeColors.text }]}>Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Google Map View with Heatmap */}
            <View style={[styles.mapPlaceholder, { backgroundColor: themeColors.surface }]}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={themeColors.primary} />
                        <Text style={{ marginTop: 10, color: themeColors.icon }}>Loading Map Data...</Text>
                    </View>
                ) : (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={initialRegion}
                        showsUserLocation={true}
                        mapType="standard"
                    >
                        {heatmapData.length > 0 && (
                            <Heatmap
                                points={heatmapData}
                                radius={50}
                                opacity={0.8}
                                gradient={{
                                    colors: ["#2ECC71", "#F1C40F", "#FF4757"], // Green (Low) -> Yellow (Medium) -> Red (High)
                                    startPoints: [0.1, 0.4, 0.7],
                                    colorMapSize: 256,
                                }}
                            />
                        )}
                        {heatmapData.map((zone, index) => {
                            // Show markers for areas with cases
                            if (zone.weight < 2) return null; 
                            
                            return (
                                <Marker
                                    key={index}
                                    coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
                                    title={zone.district}
                                    description={`Cases: ${zone.cases}`}
                                    pinColor={zone.weight > 8 ? '#FF4757' : '#F1C40F'}
                                />
                            );
                        })}
                    </MapView>
                )}

                <View style={styles.mapOverlay}>
                    <Text style={[styles.mapStatus, { color: themeColors.icon }]}>
                        {errorMsg ? errorMsg : "Showing live dengue risk clusters across Sri Lanka."}
                    </Text>
                </View>
            </View>

            <View style={styles.legendContainer}>
                <Text style={[styles.legendTitle, { color: themeColors.text }]}>Risk Legend</Text>
                <View style={styles.legendRow}>
                    <LegendItem color="#FF4757" label="High Risk" />
                    <LegendItem color="#F1C40F" label="Medium Risk" />
                    <LegendItem color="#2ECC71" label="Low Risk" />
                </View>
            </View>

            <Card style={styles.infoCard}>
                <View style={styles.infoContent}>
                    <IconSymbol name="exclamationmark.shield.fill" size={24} color={themeColors.primary} />
                    <View>
                        <Text style={[styles.infoTitle, { color: themeColors.text }]}>Safety Alert</Text>
                        <Text style={[styles.infoDesc, { color: themeColors.icon }]}>
                            {heatmapData.length > 0 
                                ? `Highest activity detected in ${heatmapData.reduce((prev, current) => (prev.cases > current.cases) ? prev : current).district}.`
                                : "Analyzing current risk data..."}
                        </Text>
                    </View>
                </View>
            </Card>
        </View>
    );
}

function LegendItem({ color, label }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );
}


// Internal styles removed, now using external exploreStyles


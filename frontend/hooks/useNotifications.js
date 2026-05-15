import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/constants/api';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_LOCATION_TASK = 'background-location-task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- Shared Notification Logic ---
// This function can be called from the UI hook or the background task
export const updateNotificationLogic = async (coords = null) => {
  try {
    const time = await SecureStore.getItemAsync('notificationTime');
    const enabled = await SecureStore.getItemAsync('notificationsEnabled');
    
    // If notifications are disabled or no time is set, don't schedule
    if (!time || enabled === 'false') return false;
    
    const [hour, minute] = time.split(':').map(Number);

    let currentDistrict = "Your Location";
    let riskLevel = "Moderate";
    let casesCount = 0;

    try {
      let lat, lng;
      if (coords) {
        lat = coords.latitude;
        lng = coords.longitude;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return false;
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = loc.coords.latitude;
        lng = loc.coords.longitude;
      }

      const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (geocode.length > 0) {
        currentDistrict = geocode[0].subregion || geocode[0].district || geocode[0].city || "Your Area";
      }

      // Fetch risk data from heatmap
      const response = await fetch(`${API_BASE_URL}/heatmap`);
      const heatmapData = await response.json();
      
      const districtData = heatmapData.find(d => 
        d.district.toLowerCase() === currentDistrict.toLowerCase() ||
        currentDistrict.toLowerCase().includes(d.district.toLowerCase()) ||
        d.district.toLowerCase().includes(currentDistrict.toLowerCase())
      );

      if (districtData) {
        casesCount = districtData.cases;
        if (districtData.weight > 0.7) riskLevel = "High Risk";
        else if (districtData.weight > 0.3) riskLevel = "Moderate Risk";
        else riskLevel = "Low Risk";
      }
    } catch (err) {
      console.warn("Location/Risk fetch failed:", err);
    }

    // Schedule the notification
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);
    
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    const secondsUntilTarget = Math.max(1, Math.floor((target.getTime() - now.getTime()) / 1000));
    const riskIcon = riskLevel.includes("High") ? "🔴" : riskLevel.includes("Moderate") ? "🟡" : "🟢";

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🛡️ Dengue Risk Update: ${currentDistrict}`,
        body: `${riskIcon} Risk Status: ${riskLevel}${casesCount > 0 ? ` (${casesCount} active cases nearby)` : ''}. Please stay vigilant and take necessary precautions.`,
        data: { screen: 'Explore' },
        sound: true,
        vibrationPattern: [0, 250, 250, 250],
      },
      trigger: {
        type: 'timeInterval',
        seconds: secondsUntilTarget,
        repeats: false,
      },
    });
    
    console.log(`Notification updated: ${currentDistrict} - ${riskLevel}`);
    return true;
  } catch (e) {
    console.error('Error in updateNotificationLogic:', e);
    return false;
  }
};

// --- Background Task Definition ---
// Must be at the top level
TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    if (locations && locations[0]) {
      console.log('Background location update: updating alert content...');
      await updateNotificationLogic(locations[0].coords);
    }
  }
});

export const useNotifications = () => {
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('FCM Token:', token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    if (token) {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');
        if (userToken) {
          await fetch(`${API_BASE_URL}/register_fcm_token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify({ fcm_token: token }),
          });
          console.log('Token registered on backend');
        }
      } catch (e) {
        console.error('Error registering token:', e);
      }
    }

    return token;
  };

  const startBackgroundLocationAsync = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') return false;

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.warn('Background location permission denied');
        return false;
      }

      const isRunning = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      if (!isRunning) {
        await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 1000, // Update every 1km
          deferredUpdatesInterval: 1000 * 60 * 15, // 15 mins
          foregroundService: {
            notificationTitle: "Dengue Risk Monitor",
            notificationBody: "Providing live alerts based on your location",
            notificationColor: "#FF4757"
          }
        });
        console.log('Background location tracking started');
      }
      return true;
    } catch (e) {
      console.error('Failed to start background location:', e);
      return false;
    }
  };

  const stopBackgroundLocationAsync = async () => {
    try {
      const isRunning = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
      if (isRunning) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
        console.log('Background location tracking stopped');
      }
    } catch (e) {
      console.error('Failed to stop background location:', e);
    }
  };

  const scheduleDailyAlert = async (hour, minute) => {
    try {
      // Store settings
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      await SecureStore.setItemAsync('notificationTime', timeStr);
      await SecureStore.setItemAsync('notificationsEnabled', 'true');

      // Update notification immediately
      await updateNotificationLogic();
      
      // Start background tracking
      await startBackgroundLocationAsync();
      
      return true;
    } catch (e) {
      console.error('Error scheduling notification:', e);
      return false;
    }
  };

  return { 
    registerForPushNotificationsAsync, 
    scheduleDailyAlert, 
    startBackgroundLocationAsync, 
    stopBackgroundLocationAsync 
  };
};



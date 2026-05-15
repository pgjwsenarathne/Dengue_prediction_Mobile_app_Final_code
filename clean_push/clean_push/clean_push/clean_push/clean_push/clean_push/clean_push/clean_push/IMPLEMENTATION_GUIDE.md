# Project Update: SARIMAX, Heatmap & Push Notifications

I have implemented the core logic for SARIMAX time-series forecasting, danger area heatmaps, and Firebase Cloud Messaging (FCM) integration.

## 🚀 1. SARIMAX Implementation
SARIMAX (Seasonal AutoRegressive Integrated Moving Average with eXogenous factors) is now integrated for better time-series predictions.

- **Training Script**: I created `backend/train_sarimax.py` which trains the model using your existing CSV data.
- **Model File**: `backend/sarimax_model.joblib` was generated and is ready to use.
- **API Endpoint**: Added `/predict_sarimax` in `backend/app.py`.

## 🗺️ 2. Danger Area Heatmap
The "Explore" tab now fetches real danger area data from the backend.

- **API Endpoint**: Added `/heatmap` in `backend/app.py` which returns coordinates and case weights.
- **Frontend Update**: Updated `frontend/app/(tabs)/explore.jsx` to dynamically render risk markers based on backend data.

## 🔔 3. Push Notifications (FCM)
Boilerplate for real-time mobile alerts is implemented.

- **Backend**: Added `/register_fcm_token` and Firebase initialization.
- **Frontend Hook**: Created `frontend/hooks/useNotifications.js` to handle permission requests and token registration.
- **Auto-Registration**: The app now automatically registers for notifications on startup in `frontend/app/_layout.jsx`.

---

## 🛠️ Action Required: Firebase Setup
To make push notifications work, you need to complete these steps:

### Step 1: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named "Dengue Prediction".
3. Go to **Project Settings > Service Accounts**.
4. Click **Generate new private key** and download the JSON file.
5. Save this file as `firebase-service-account.json` in your `backend/` folder.
6. Add the path to your `.env` file:
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
   ```

### Step 2: Install Frontend Dependencies
Run these commands in your `frontend/` directory to install the necessary Expo modules:
```bash
npx expo install expo-notifications expo-device expo-constants
```

---

## ✅ How to Test
1. **Restart Backend**: Run `python app.py` (it will load both models now).
2. **Predict with SARIMAX**: You can now call `/predict_sarimax` instead of `/predict` for context-aware forecasting.
3. **View Heatmap**: Open the **Explore** tab in the app to see markers generated from the CSV data.

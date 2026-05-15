import joblib
import pandas as pd

def test_models():
    print("Testing Standard Model...")
    try:
        model = joblib.load('backend/dengue_model.pkl')
        test_data = pd.DataFrame([{
            'Temp_avg': 28.5,
            'Precipitation_avg': 120.0,
            'Humidity_avg': 75.0,
            'Rainfall_Lag_1': 120.0  # Added proxy
        }])
        pred = model.predict(test_data)
        print(f"Standard Model Prediction: {pred[0]}")
    except Exception as e:
        print(f"Standard Model Error: {e}")

    print("\nTesting SARIMAX Model...")
    try:
        sarimax_model = joblib.load('backend/sarimax_model.joblib')
        exog_data = pd.DataFrame([{
            'Temp_avg': 28.5,
            'Precipitation_avg': 120.0,
            'Humidity_avg': 75.0
        }])
        forecast = sarimax_model.get_forecast(steps=1, exog=exog_data)
        predicted_cases = max(0.0, round(float(forecast.predicted_mean.iloc[0]), 2))
        print(f"SARIMAX Forecast: {predicted_cases}")
    except Exception as e:
        print(f"SARIMAX Model Error: {e}")

if __name__ == "__main__":
    test_models()

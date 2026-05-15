import pandas as pd
df = pd.read_csv('dengue_data_with_weather_data.csv')
print(df.columns.tolist())
print(df.head())

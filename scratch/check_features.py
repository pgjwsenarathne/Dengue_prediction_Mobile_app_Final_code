import joblib

model = joblib.load('backend/dengue_model.pkl')
print(model.feature_names_in_)

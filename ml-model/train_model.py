import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_crop_model():
    # 1. Load the dataset
    print("Loading dataset...")
    try:
        df = pd.read_csv('Crop_recommendation.csv')
    except FileNotFoundError:
        print("Error: 'Crop_recommendation.csv' not found. Please ensure the file is in the same directory.")
        return

    # 2. Split features and target
    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
    # Check if all required columns exist in the dataset
    if not all(col in df.columns for col in features + ['label']):
        print("Error: The dataset is missing one or more required columns.")
        return

    X = df[features]
    y = df['label']

    # 3. Train the model
    print("Training RandomForestClassifier...")
    # Using random_state for reproducibility 
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # 4. Save the model
    model_filename = 'model.pkl'
    joblib.dump(model, model_filename)
    
    # 5. Print success message
    print(f"Success! Model trained and saved as '{model_filename}'")

if __name__ == "__main__":
    train_crop_model()
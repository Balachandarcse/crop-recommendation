from flask import Flask, request, jsonify
import joblib
import pandas as pd

# 1. Initialize the Flask application
app = Flask(__name__)

# 2. Load the trained model globally so it only loads once when the server starts
try:
    model = joblib.load('model.pkl')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# 3. Create the POST endpoint
@app.route('/predict', methods=['POST'])
def predict():
    # Ensure the model is available before trying to predict
    if model is None:
        return jsonify({'error': 'Model not found. Please ensure model.pkl exists.'}), 500

    try:
        # Parse the incoming JSON request
        data = request.get_json()

        # If no JSON data is sent
        if not data:
            return jsonify({'error': 'No JSON payload provided.'}), 400

        # Define the exact features the model expects
        required_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

        # Check for any missing fields in the incoming data
        missing_fields = [field for field in required_features if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        # 4. Convert input into the correct format for prediction
        # We put the values in a list to create a single-row DataFrame.
        # Using a DataFrame matches the format the model was trained on.
        input_data = pd.DataFrame({
            'N': [data['N']],
            'P': [data['P']],
            'K': [data['K']],
            'temperature': [data['temperature']],
            'humidity': [data['humidity']],
            'ph': [data['ph']],
            'rainfall': [data['rainfall']]
        })

        # 5. Use the model to predict the crop
        prediction = model.predict(input_data)
        
        # The prediction is an array (e.g., ['rice']). We grab the first element.
        predicted_crop = prediction[0]

        # 6. Return the response
        return jsonify({'crop': predicted_crop}), 200

    except Exception as e:
        # Generic error handling for unexpected issues (e.g., wrong data types)
        return jsonify({'error': f'An error occurred during prediction: {str(e)}'}), 500


if __name__ == '__main__':
    # Start the Flask server
    app.run(debug=True, host='0.0.0.0', port=5000)
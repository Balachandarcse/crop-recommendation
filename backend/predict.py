import sys
import joblib
import pandas as pd

def predict():
    try:
        # Load the saved model
        model = joblib.load('model.pkl')

        # Read the 7 arguments passed by Node.js
        # sys.argv[0] is the script name, so data starts at index 1
        data = {
            'N': [float(sys.argv[1])],
            'P': [float(sys.argv[2])],
            'K': [float(sys.argv[3])],
            'temperature': [float(sys.argv[4])],
            'humidity': [float(sys.argv[5])],
            'ph': [float(sys.argv[6])],
            'rainfall': [float(sys.argv[7])]
        }

        # Convert to DataFrame to match training format and avoid warnings
        input_df = pd.DataFrame(data)

        # Predict and print ONLY the crop name
        prediction = model.predict(input_df)
        print(prediction[0])

    except Exception as e:
        # If anything goes wrong, print the error to standard error
        print(str(e), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    predict()
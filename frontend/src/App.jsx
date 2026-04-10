import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';

function App() {
  // State management for API data, loading status, and errors
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the API call when the form is submitted
  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setResultData(null);

    try {
      // POST request to your Node.js backend
      const response = await fetch('https://crop-recommendation-v49z.onrender.com/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction. Ensure your backend is running.');
      }

      const data = await response.json();
      setResultData(data); // Save the response data to state
    } catch (err) {
      setError(err.message); // Save error message to state
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-800 mb-2">
            AgriProfit Recommender
          </h1>
          <p className="text-lg text-green-600">
            Enter your soil and weather data to find the most profitable crop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div>
            <InputForm onSubmit={handlePredict} isLoading={loading} />
          </div>

          {/* Right Column: Results, Loading, or Errors */}
          <div className="flex flex-col justify-center">
            {loading && (
              <div className="flex flex-col items-center justify-center text-green-700">
                {/* Tailwind Spinner */}
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
                <p className="text-lg font-medium">Analyzing environment...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                <h3 className="text-red-800 font-bold mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {resultData && !loading && !error && (
              <ResultCard data={resultData} />
            )}

            {!resultData && !loading && !error && (
              <div className="bg-white p-8 rounded-xl shadow-md border border-green-100 text-center text-gray-500 h-full flex items-center justify-center">
                Submit your field data to see the recommended crop and expected profit here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';

const InputForm = ({ onSubmit, isLoading }) => {
  // Local state to track form inputs
  const [formData, setFormData] = useState({
    N: '', P: '', K: '',
    temperature: '', humidity: '', ph: '', rainfall: ''
  });

  // Update specific field on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert string inputs to numbers for the API
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Array of input configuration to map over and keep code DRY
  const inputFields = [
    { label: 'Nitrogen (N)', name: 'N', placeholder: 'e.g., 90' },
    { label: 'Phosphorus (P)', name: 'P', placeholder: 'e.g., 42' },
    { label: 'Potassium (K)', name: 'K', placeholder: 'e.g., 43' },
    { label: 'Temperature (°C)', name: 'temperature', placeholder: 'e.g., 20.8' },
    { label: 'Humidity (%)', name: 'humidity', placeholder: 'e.g., 82.0' },
    { label: 'pH Level', name: 'ph', placeholder: 'e.g., 6.5' },
    { label: 'Rainfall (mm)', name: 'rainfall', placeholder: 'e.g., 202.9' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Field Parameters</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                step="any" // Allows decimals
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 py-3 px-4 text-white font-bold rounded-lg shadow-md transition-all ${
            isLoading 
              ? 'bg-green-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? 'Processing...' : 'Get Recommendation'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
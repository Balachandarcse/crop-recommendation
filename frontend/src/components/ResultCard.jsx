const ResultCard = ({ data }) => {
  // Destructure data from props
  const { crop, profit, yield: cropYield, price, cost, explanation, risk } = data;

  // Capitalize the first letter of the crop name
  const formattedCrop = crop.charAt(0).toUpperCase() + crop.slice(1);

  // Determine risk styling based on the risk text
  const isHighRisk = risk.toLowerCase().includes('risk') && risk.toLowerCase() !== 'low risk';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-500 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full -z-10 opacity-50"></div>

      {/* Main Recommendation */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Recommended Crop</p>
        <h2 className="text-4xl font-extrabold text-green-700 mb-2">{formattedCrop}</h2>
        <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {explanation}
        </div>
      </div>

      {/* Highlighted Profit Section */}
      <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200 text-center">
        <p className="text-sm text-gray-600 font-medium mb-1">Estimated Profit</p>
        <p className="text-4xl font-black text-green-800">
          ₹{profit.toLocaleString()}
        </p>
      </div>

      {/* Economics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6 border-t border-b border-gray-100 py-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Yield</p>
          <p className="text-lg font-bold text-gray-800">{cropYield} t/ha</p>
        </div>
        <div className="text-center border-l border-r border-gray-100">
          <p className="text-xs text-gray-500 font-medium uppercase">Market Price</p>
          <p className="text-lg font-bold text-gray-800">₹{price}/kg</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium uppercase">Input Cost</p>
          <p className="text-lg font-bold text-red-600">₹{cost.toLocaleString()}</p>
        </div>
      </div>

      {/* Risk Warning Section */}
      <div className={`p-3 rounded-md text-sm font-medium flex items-center justify-center ${
        isHighRisk ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
      }`}>
        <span className="mr-2">
          {isHighRisk ? '⚠️' : '✅'}
        </span>
        {risk}
      </div>
    </div>
  );
};

export default ResultCard;
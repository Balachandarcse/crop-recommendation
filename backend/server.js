require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process'); // Native Node.js module to run commands
const path = require('path');

// Initialize Express App
const app = express();
app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 5001;

// Load crop data from local JSON file
const cropsData = require('./crops_profit.json');

// POST Endpoint: /api/predict
app.post('/api/predict', (req, res) => {
    // 1. Receive input from client
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

    if ([N, P, K, temperature, humidity, ph, rainfall].includes(undefined)) {
        return res.status(400).json({ error: "Missing required environmental parameters." });
    }

    // 2. Spawn a Python child process
    // We execute: python predict.py <N> <P> <K> ...
    const pythonProcess = spawn('python3', [
        path.join(__dirname, 'predict.py'),
        N, P, K, temperature, humidity, ph, rainfall
    ]);

    let predictedCrop = '';
    let errorOutput = '';

    // 3. Capture the output printed by the Python script
    pythonProcess.stdout.on('data', (data) => {
        predictedCrop += data.toString();
    });

    // Capture any errors thrown by Python
    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    // 4. Handle the event when the Python script finishes
    pythonProcess.on('close', (code) => {
        // If code is not 0, the Python script crashed
        if (code !== 0) {
            console.error("Python script error:", errorOutput);
            return res.status(500).json({ error: "Failed to generate prediction from the model." });
        }

        // Clean up the output string (removes invisible newline characters)
        predictedCrop = predictedCrop.trim();

        // 5. Fetch crop economy data from crops_profit.json
        const cropInfo = cropsData[predictedCrop];

        if (!cropInfo) {
            return res.status(404).json({ 
                error: `Economics data for predicted crop '${predictedCrop}' not found in local database.` 
            });
        }

        // 6. Calculate profit (Yield * Price * 1000) - Cost
        const profit = (cropInfo.yield * cropInfo.price * 1000) - cropInfo.cost;

        // 7. Additional Logic: Risk Assessment
        let risk = "Low risk";
        if (rainfall < 50) {
            risk = "Low rainfall risk";
        } else if (temperature > 40) {
            risk = "High temperature risk";
        }

        let explanation = `The soil conditions are optimal for ${predictedCrop}.`;
        if (risk !== "Low risk") {
            explanation = `Proceed with caution. The environment supports ${predictedCrop}, but mitigate the ${risk.toLowerCase()}.`;
        }

        // 8. Output Response
        return res.json({
            crop: predictedCrop,
            yield: cropInfo.yield,
            price: cropInfo.price,
            cost: cropInfo.cost,
            profit: profit,
            explanation: explanation,
            risk: risk
        });
    });
});

// Start the Node.js Server
app.listen(PORT, () => {
    console.log(`Node.js backend running on http://localhost:${PORT}`);
    console.log(`Predictions are being powered locally via Python child_process.`);
});
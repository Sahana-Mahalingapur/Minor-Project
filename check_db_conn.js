const mongoose = require('mongoose');

const MONGO_URI = "mongodb://localhost:27017/farmcare";

console.log("Attempting to connect to MongoDB...");

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ SUCCESS: MongoDB is running and accessible!");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ FAILURE: Could not connect to MongoDB.");
        console.error("Error details:", err.message);
        process.exit(1);
    });

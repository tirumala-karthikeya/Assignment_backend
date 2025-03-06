const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://jkarthikeya2004:karthikeya@cluster0.slrlm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

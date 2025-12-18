const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not defined. Check your backend/.env file.");
    throw new Error("MONGO_URI is not defined");
  }

  console.log("Connecting to MongoDB with URI:", uri.slice(0, 40) + "...");

  await mongoose.connect(uri);
  console.log("MongoDB Connected");
};

module.exports = connectDB;

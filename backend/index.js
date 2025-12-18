const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./utils/errorHandlers");

// Load env and connect DB
dotenv.config();
connectDB();

const app = express();

// --- Global middlewares ---
// CORS: allow all origins in development
app.use(cors());
// Body parser
app.use(express.json());

// --- Routes ---
app.use("/api/auth", require("./routes/authoroutes"));
app.use("/api/events", require("./routes/eventroutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Mini Event Platform API running" });
});

// --- Error handlers ---
app.use(notFound);
app.use(errorHandler);

// --- Server start ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

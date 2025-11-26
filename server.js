require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const uploadRoutes = require("./routes/upload");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// serve your frontend folder (change if needed)
app.use("/", express.static(path.join(__dirname, "..", "Minor Project Frontend")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

// connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => console.log("DB Error:", err));

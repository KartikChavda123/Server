// -------------------------
// Imports
// -------------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import CategoryRoute from "./Routes/Category.js";
import AuthRoute from "./Routes/AuthRoute.js";
import ProductRoute from "./Routes/Product.js";
import VideoRoute from "./Routes/Video.js";
import ContactRoute from "./Routes/ContactRoute.js";
import HomeImgRoute from "./Routes/HomeImgRoute.js";

// -------------------------
// Config
// -------------------------
dotenv.config();
const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------
// Allowed Frontend URLs
// -------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",

  process.env.ORIGIN,
  process.env.FRONT_END_URL,
  process.env.CLIENT_ORIGIN,
  process.env.ALT_CLIENT_ORIGIN,
  process.env.ADMIN_PANEL_URL,
  process.env.PUBLIC_WEBSITE_URL,

  // Render live admin panel
  "https://admin-side-0wnj.onrender.com",

  // Netlify live website
  "https://vocal-sunburst-c95dce.netlify.app",
].filter(Boolean);

console.log("🔵 Allowed Origins:", allowedOrigins);

// -------------------------
// CORS (MUST BE FIRST)
// -------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow Postman / server

      if (allowedOrigins.includes(origin)) {
        console.log("🟢 CORS Allow:", origin);
        return callback(null, true);
      }

      console.log("🔴 CORS Blocked:", origin);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ⚠️ Removed invalid Express v5 wildcard causing crash
// app.options("*", cors());

// -------------------------
// Middleware
// -------------------------
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// Routes (PREFIX = /api)
// -------------------------
app.use("/api", CategoryRoute);
app.use("/api", AuthRoute);
app.use("/api", ProductRoute);
app.use("/api", VideoRoute);
app.use("/api", ContactRoute);
app.use("/api", HomeImgRoute);

// Root test route
app.get("/", (req, res) => {
  res.send("<h2>🚀 Gemini Server Running Successfully</h2>");
});

// -------------------------
// Start Server after DB Connect
// -------------------------
const PORT = process.env.PORT || 8008;
const HOST = "0.0.0.0";

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("🟢 MongoDB Connected");

    app.listen(PORT, HOST, () => {
      console.log(`🟢 Server Started on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("🔴 DB Error:", err);
    process.exit(1);
  });

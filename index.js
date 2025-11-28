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

  "https://admin-side-0wnj.onrender.com",
  "https://hilarious-entremet-93099a.netlify.app",
].filter(Boolean);

console.log("🔵 Allowed Origins:", allowedOrigins);

// -------------------------
// CORS (UPDATED + FIXED)
// -------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        console.log("🟢 CORS: No origin (Postman / server)");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("🟢 CORS Allow (List):", origin);
        return callback(null, true);
      }

      if (/\.onrender\.com$/.test(origin) || /\.netlify\.app$/.test(origin)) {
        console.log("🟢 CORS Allow (Pattern):", origin);
        return callback(null, true);
      }

      console.log("🔴 CORS Blocked:", origin);
      return callback(new Error(`Not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

// 🔥 Handle OPTIONS preflight for all routes
app.options("*", cors());

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

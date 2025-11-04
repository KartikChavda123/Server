import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import CategoryRoute from "./Routes/Category.js";
import path from "path";
import { fileURLToPath } from "url";
import AuthRoute from "./Routes/AuthRoute.js";
import ProductRoute from "./Routes/Product.js";
import VideoRoute from "./Routes/Video.js";
import ContactRoute from "./Routes/ContactRoute.js";
import HomeImgRoute from "./Routes/HomeImgRoute.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const databaseURL = process.env.DATABASE_URL;

// app.use(
//   cors({
//     origin: process.env.ORIGIN,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );

const allowedOrigins = [
  process.env.ORIGIN,
  process.env.FRONT_END_URL,
  process.env.CLIENT_ORIGIN,
  process.env.ALT_CLIENT_ORIGIN,
  "https://cute-travesseiro-ed1424.netlify.app",
];

console.log("✅ Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/api", CategoryRoute);
app.use("/api", AuthRoute);
app.use("/api", ProductRoute);
app.use("/api", VideoRoute);
app.use("/api", ContactRoute);
app.use("/api", HomeImgRoute);

const PORT = process.env.PORT || 8008;
const HOST = "0.0.0.0"; // required for Render visibility

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running and listening on http://${HOST}:${PORT}`);
});

app.get("/", async (req, res) => {
  res.send("<h1>HII THERE IM SERVER WELCOME TO GEMINI APP</h1>");
});

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("<<<<<<database connect successfully", databaseURL);
  })
  .catch((error) => console.log("<<<ERROR", error));

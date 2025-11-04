import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.join(__dirname, "../uploads");
    let sub;

    if (file.fieldname === "catalougePDF") sub = "pdfs";
    else if (file.fieldname === "thumbnail") sub = "thumbnails";
    else if (file.fieldname === "images") sub = "images";
    else if (file.fieldname === "mainvideo") sub = "video";
    else if (file.fieldname === "homeimageUrl") sub = "homeimg";
    else if (file.fieldname === "parentImage") sub = "parentimg";

    else sub = "misc";

    const uploadPath = path.join(base, sub);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "catalougePDF") {
    if (ext !== ".pdf")
      return cb(new Error("Only PDF allowed for catalougePDF"));
  }

  if (
    file.fieldname === "thumbnail" ||
    file.fieldname === "images" ||
    file.fieldname === "homeimageUrl" ||
    file.fieldname === "parentImage" 
  ) {
    const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    if (!allowed.includes(ext))
      return cb(new Error("Only image files are allowed"));
  }

  if (file.fieldname === "mainvideo") {
    const allowed = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
    if (!allowed.includes(ext)) {
      return cb(new Error("Only video files are allowed"));
    }
  }

  cb(null, true);
};

export const upload = multer({ storage, fileFilter });

// Use this in route
export const uploadFields = upload.fields([
  { name: "catalougePDF", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const uploadProductImages = upload.fields([
  { name: "images", maxCount: 10 },       // multiple images
  { name: "parentImage", maxCount: 1 }    // single parent image
]);

export const uploadMainVideo = upload.single("mainvideo");

export const uploadHomeImage = upload.single("homeimageUrl");

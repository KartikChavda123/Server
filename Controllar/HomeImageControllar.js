import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { HomeVideo } from "../Models/HomeImageModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// turn "/uploads/videos/xyz.mp4" -> absolute path
const absFromPublic = (p) =>
  p ? path.join(__dirname, "..", p.replace(/^\/+/, "")) : null;

// safe delete
const safeUnlink = (absPath) => {
  if (!absPath) return;
  fs.stat(absPath, (err) => {
    if (!err) fs.unlink(absPath, () => {});
  });
};

export const AddHomeImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No homeimg file uploaded" });

    const imageUrl = `/uploads/homeimg/${req.file.filename}`;

    console.log("SAVED FILE >>>", req.file);

    // 1) find existing single doc
    const existing = await HomeVideo.findOne();

    console.log("<<<<<<videoUrl", imageUrl);
    if (existing) {
      // delete previous file if present
      if (existing.ImageUrl) safeUnlink(absFromPublic(existing.ImageUrl));
      // update same doc
      existing.ImageUrl = imageUrl;
      await existing.save();

      return res.status(200).json({
        message: "Video replaced successfully!",
        Image: existing,
      });
    }

    // 2) create first/only doc
    const created = await HomeVideo.create({ ImageUrl: imageUrl });
    return res.status(201).json({
      message: "Video uploaded successfully!",
      Image: created,
    });
  } catch (error) {
    console.error("AddHomeImage Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const GetImage = async (req, res) => {
  try {
    const ImgData = await HomeVideo.find();

    res.status(200).json({
      message: "Collections fetched successfully",
      ImgData,
    });
  } catch (error) {
    console.error("AddHomeImage Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

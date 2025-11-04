import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Video } from "../Models/VideoModel.js";

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

export const AddVideo = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No video file uploaded" });

    const videoUrl = `/uploads/video/${req.file.filename}`;
    
    console.log("SAVED FILE >>>", req.file);

    // 1) find existing single doc
    const existing = await Video.findOne();

    console.log("<<<<<<videoUrl", videoUrl);
    if (existing) {
      // delete previous file if present
      if (existing.videoUrl) safeUnlink(absFromPublic(existing.videoUrl));
      // update same doc
      existing.videoUrl = videoUrl;
      await existing.save();

      return res.status(200).json({
        message: "Video replaced successfully!",
        video: existing,
      });
    }

    // 2) create first/only doc
    const created = await Video.create({ videoUrl });
    return res.status(201).json({
      message: "Video uploaded successfully!",
      video: created,
    });
  } catch (error) {
    console.error("AddVideo Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const GetVideo = async (req, res) => {
  try {
    const VideoData = await Video.find();

    res.status(200).json({
      message: "Collections fetched successfully",
      VideoData,
    });
  } catch (error) {
    console.error("AddVideo Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

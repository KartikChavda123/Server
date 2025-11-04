import express from "express";
import { AddVideo, GetVideo } from "../Controllar/VideoControllar.js";
import { uploadMainVideo } from "../Middleware/Multer.js";

const VideoRoute = express.Router();

VideoRoute.post(
  "/add-video",
  (req, res, next) => {
    uploadMainVideo(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  AddVideo
);

VideoRoute.get("/get-video", GetVideo);

export default VideoRoute;

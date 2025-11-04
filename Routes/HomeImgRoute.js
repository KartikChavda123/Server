import express from "express";

import { uploadHomeImage } from "../Middleware/Multer.js";
import { AddHomeImage, GetImage } from "../Controllar/HomeImageControllar.js";

const HomeImgRoute = express.Router();

HomeImgRoute.post(
  "/add-image",
  (req, res, next) => {
    uploadHomeImage(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  AddHomeImage
);

HomeImgRoute.get("/get-image", GetImage);

export default HomeImgRoute;

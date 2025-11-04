import mongoose from "mongoose";

// in VideoModel.js
const videoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  singleton: { type: String, default: "only", unique: true }, 
},{timestamps : true});

export const Video = mongoose.model("Video", videoSchema);

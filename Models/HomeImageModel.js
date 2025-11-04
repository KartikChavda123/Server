import mongoose from "mongoose";

// in VideoModel.js
const ImageSchema = new mongoose.Schema({
  ImageUrl: { type: String, required: true },
  singleton: { type: String, default: "only", unique: true }, 
},{timestamps : true});

export const HomeVideo = mongoose.model("homeimages", ImageSchema);

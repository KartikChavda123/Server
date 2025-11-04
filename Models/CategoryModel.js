import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },

    categorytype: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("category", CategorySchema);

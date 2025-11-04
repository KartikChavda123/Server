import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    parentImage: { type: String },
    // 🖼 Store file URLs or paths after upload
    images: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
    },  

    // 🧪 Chemicals used in the product
    chemicals: {
      type: [String],
      default: [],
    },

    // 🏷 Type names (like Liquid, Powder, Gel, etc.)
    typeNames: {
      type: [String],
      default: [],
    },

    // 🏭 Industrial applications
    industrialApplications: {
      type: [String],
      default: [],
    },

    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("product", ProductSchema);

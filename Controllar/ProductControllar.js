import { Product } from "../Models/ProductModel.js";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const absFromPublic = (p) => {
  if (!p) return null;
  const clean = p.replace(/^\/+/, ""); // strip leading slash
  return path.join(__dirname, "..", clean); // from controller -> project root
};

const safeUnlink = (absPath) => {
  if (!absPath) return;
  fs.stat(absPath, (err) => {
    if (!err) fs.unlink(absPath, () => {});
  });
};

// export const AddProduct = async (req, res) => {
//   try {
//     const { productName, category, description } = req.body;

//     if (!productName || !productName.trim()) {
//       return res.status(400).json({ message: "productName is required" });
//     }
//     if (!category) {
//       return res.status(400).json({ message: "category is required" });
//     }

//     // Handle files from multer
//     const filesArray = Array.isArray(req.files)
//       ? req.files
//       : req.files?.images || [];

//     // Build image URLs (plain strings)
//     const imageUrls = filesArray.map(
//       (f) => `/uploads/images/${path.basename(f.path)}`
//     );

//     // Save product
//     const newProduct = await Product.create({
//       productName: productName.trim(),
//       categories: [category], // wrap single category into array
//       description: description || "",
//       images: imageUrls, // just array of strings
//     });

//     return res.status(201).json({
//       message: "Product added successfully",
//       product: newProduct,
//     });
//   } catch (error) {
//     console.error("AddProduct Error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const AddProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      chemicals,
      typeNames,
      industrialApplications,
      relatedProducts,
    } = req.body;

    if (!productName || !productName.trim()) {
      return res.status(400).json({ message: "productName is required" });
    }

    // ✅ Parse JSON arrays
    let parsedChemicals = [];
    let parsedTypeNames = [];
    let parsedApplications = [];
    let parsedRelatedProducts = [];

    try {
      parsedChemicals = chemicals ? JSON.parse(chemicals) : [];
      parsedTypeNames = typeNames ? JSON.parse(typeNames) : [];
      parsedApplications = industrialApplications
        ? JSON.parse(industrialApplications)
        : [];

      parsedRelatedProducts = relatedProducts
        ? JSON.parse(relatedProducts)
        : [];
    } catch (err) {
      console.warn("⚠️ JSON parse error:", err.message);
    }

    // ✅ Handle multiple images (FormData)
    const imageUrls = (req.files?.images || []).map((file) => {
      return `/uploads/images/${path.basename(file.path)}`;
    });

    // ✅ Parent single image
    let parentImageUrl = "";
    if (req.files?.parentImage && req.files.parentImage[0]) {
      parentImageUrl = `/uploads/parentimg/${path.basename(
        req.files.parentImage[0].path
      )}`;
    }

    // ✅ Save product
    const newProduct = await Product.create({
      productName: productName.trim(),
      description: description || "",
      images: imageUrls,
      parentImage: parentImageUrl,
      chemicals: parsedChemicals,
      typeNames: parsedTypeNames,
      industrialApplications: parsedApplications,
      relatedProducts: parsedRelatedProducts, // ✅ NEW FIELD
    });

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("AddProduct Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const EditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      description,
      existingImages,
      chemicals,
      typeNames,
      industrialApplications,
      relatedProducts,
      existingParentImage, // ✅ keep existing logic
    } = req.body;

    const files = req.files || {};

    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    /* -----------------------------------------
       ✅ SAFELY PARSE ARRAYS
    ----------------------------------------- */
    let parsedChemicals = [];
    let parsedTypeNames = [];
    let parsedApplications = [];
    let parsedRelatedProducts = [];
    let parsedExistingImages = [];

    try {
      parsedChemicals = chemicals ? JSON.parse(chemicals) : [];
      parsedTypeNames = typeNames ? JSON.parse(typeNames) : [];
      parsedApplications = industrialApplications
        ? JSON.parse(industrialApplications)
        : [];

      parsedRelatedProducts = relatedProducts
        ? JSON.parse(relatedProducts)
        : [];

      parsedRelatedProducts = parsedRelatedProducts.map(
        (rid) => new mongoose.Types.ObjectId(rid)
      );

      // ✅ FIXED: existingImages is a string, parse it
      parsedExistingImages = existingImages ? JSON.parse(existingImages) : [];
    } catch (err) {
      console.warn("⚠️ JSON parse error in EditProduct:", err.message);
    }

    /* -----------------------------------------
       ✅ BUILD UPDATE OBJECT
    ----------------------------------------- */
    const updates = {
      productName,
      description,
      chemicals: parsedChemicals,
      typeNames: parsedTypeNames,
      industrialApplications: parsedApplications,
      relatedProducts: parsedRelatedProducts,
    };

    /* -----------------------------------------
       ✅ MULTIPLE IMAGES UPDATE (FIXED)
    ----------------------------------------- */

    if (files.images && files.images.length > 0) {
      // ✅ Delete old images
      existing.images?.forEach((oldImg) => safeUnlink(absFromPublic(oldImg)));

      // ✅ Save new images
      const newImages = files.images.map(
        (file) => `/uploads/images/${path.basename(file.path)}`
      );

      updates.images = newImages;
    } else {
      // ✅ KEEP EXISTING IMAGES (IMPORTANT FIX)
      updates.images =
        parsedExistingImages.length > 0
          ? parsedExistingImages
          : existing.images || [];
    }

    /* -----------------------------------------
       ✅ PARENT IMAGE UPDATE (UNCHANGED)
    ----------------------------------------- */
    if (files.parentImage && files.parentImage.length > 0) {
      if (existing.parentImage) {
        safeUnlink(absFromPublic(existing.parentImage));
      }

      const parentFile = files.parentImage[0];

      updates.parentImage = `/uploads/parentimg/${path.basename(
        parentFile.path
      )}`;
    } else {
      updates.parentImage = existingParentImage || existing.parentImage || "";
    }

    /* -----------------------------------------
       ✅ UPDATE PRODUCT
    ----------------------------------------- */
    const updated = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("EditProduct Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const GetAllProduct = async (req, res) => {
  try {
    const Products = await Product.find();

    res.status(200).json({
      message: "Collections fetched successfully",
      Products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetProductbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const Products = await Product.findById(id).populate(
      "relatedProducts",
      "productName parentImage"
    );

    res.status(200).json({
      message: "Products fetched successfully",
      Products,
    });
  } catch (error) {
    console.error("GetProductById Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // collection ID

    const deletedData = await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Collection updated successfully",
      collection: deletedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

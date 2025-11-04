import express from "express";
import {
  AddCategory,
  DeleteCategory,
  EditCategory,
  GetAllCategory,
  GetCategorybyId,
} from "../Controllar/CategoryControllar.js";

const CategoryRoute = express.Router();

CategoryRoute.post("/add-category", AddCategory);

// ✅ Edit category by ID
CategoryRoute.put("/edit-category/:id", EditCategory);

// ✅ Get all categories
CategoryRoute.get("/get-category", GetAllCategory);

// ✅ Get category by ID
CategoryRoute.get("/get-category-byid/:id", GetCategorybyId);

// ✅ Delete category by ID
CategoryRoute.delete("/delete-category/:id", DeleteCategory);

export default CategoryRoute;

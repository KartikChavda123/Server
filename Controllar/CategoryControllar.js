import { Category } from "../Models/CategoryModel.js";

export const AddCategory = async (req, res) => {
  try {
    const { categoryName, categorytype } = req.body; // match the schema

    // Check if collection already exists
    const existing = await Category.findOne({ categoryName, categorytype });
    if (existing) {
      return res.status(400).json({ message: "Collection already exists" });
    }

    // Save new collection
    const newApplication = new Category({ categoryName, categorytype });
    await newApplication.save();

    res.status(201).json({
      message: "Collection added successfully",
      applications: newApplication,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const EditCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categorytype } = req.body; // match schema

    console.log("<<<category", categoryName, categorytype);


    const existing = await Category.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "category not found" });
    }

    const updatedData = await Category.findByIdAndUpdate(
      id,
      { categoryName, categorytype }, // ✅ matches schema
      { new: true }
    );

    res.status(200).json({
      message: "category updated successfully",
      applications: updatedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // collection ID

    const deletedData = await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Collection updated successfully",
      collection: deletedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetAllCategory = async (req, res) => {
  try {
    const category = await Category.find(); // fetch all collections

    res.status(200).json({
      message: "category fetched successfully",
      category, // return array under 'collections'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetCategorybyId = async (req, res) => {
  try {
    const { id } = req.params; // collection ID

    const category = await Category.findById(id); // fetch all collections

    res.status(200).json({
      message: "Collections fetched successfully",
      category, // return array under 'collections'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
  
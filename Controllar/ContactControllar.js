import { Contact } from "../Models/ContactModel.js";

export const AddEnquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body; // match the schema

    // Save new collection
    const newEnquiry = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });
    await newEnquiry.save();

    res.status(201).json({
      message: "New Enquiry added successfully",
      contactData: newEnquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEnquiry = async (req, res) => {
  try {
    const Enquiry = await Contact.find(); // fetch all collections

    res.status(200).json({
      message: " fetched successfully",
      Enquiry, // return array under 'collections'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const DeleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params; // collection ID

    const deletedData = await Contact.findByIdAndDelete(id);

    res.status(200).json({
      message: "Collection updated successfully",
      collection: deletedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

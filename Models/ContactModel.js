import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("contact", ContactSchema);

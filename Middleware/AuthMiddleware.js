import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (res, user, message) => {
  try {
    // Generate JWT
    const token = jwt.sign({ userId: user?._id }, process?.env?.JWT_KEY, {
      expiresIn: "7d", // Token expires in 1 day
    });

    console.log("<<<<", process?.env?.JWT_KEY);

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict", // Prevent cross-site request forgery
      secure: process.env.NODE_ENV === "production", // Secure cookies for HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send JSON response
    return res.status(200).json({
      success: true,
      token,
      message,
      user,
    });
    
  } catch (error) {
    console.error("Error generating token:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate token",
    });
  }
};

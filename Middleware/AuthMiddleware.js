import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (res, user, message) => {
  try {
    // Generate JWT
    const token = jwt.sign({ userId: user?._id }, process?.env?.JWT_KEY, {
      expiresIn: "7d",
    });

    console.log("<<<<", process?.env?.JWT_KEY);

    // Cookie Fix for Render Deployment
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,                // required on HTTPS (Render)
      sameSite: "None",           // FIX: allow cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

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


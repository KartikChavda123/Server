import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (res, user, message) => {
  try {
    const token = jwt.sign({ userId: user?._id }, process.env.JWT_KEY, {
      expiresIn: "7d", // 7 days
    });

    console.log("<<<<", process.env.JWT_KEY);

    res.cookie("token", token, {
      httpOnly: true,
      // ✅ In production (Render), allow cross-site cookies
      //    In dev, keep it relaxed so localhost works
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production", // true on Render (https)
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

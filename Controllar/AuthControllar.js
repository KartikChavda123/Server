import { generateToken } from "../Middleware/AuthMiddleware.js";
import UserData from "../Models/AuthModel.js";
import nodemailer from "nodemailer";
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await UserData.findOne({ email });

    // Compare entered password with hashed password in DB
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // If password is valid, generate token & login
    return generateToken(res, user, "Login successful");
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const Logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxage: 0 })
      .json({ message: "logout SuccessFully", success: true });
  } catch (error) {
    console.error("Error during Logout:", error.message);
    return res
      .status(500)
      .json({ message: "Failed To Logout", success: false });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserData.findById(id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Profile Not Found", success: false });
    }

    return res.status(200).json({
      message: "Profile Fetch SuccessFully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile fetch SuccessFully:", error.message);
    res.status(500).json({ message: "Failed To Load User", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, number, email, password, photoUrl } = req.body;

    // Find the user

    console.log(
      "<<<name, number, email, password ,photoUrl",
      name,
      number,
      email,
      password,
      photoUrl
    );

    const user = await UserData.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found", success: false });
    }

    let updateData = {
      name,
      number,
      email,
      password,
      photoUrl,
    };

    // Update the user in the database
    const updatedUser = await UserData.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: "Profile Updated Successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed To Update Profile:", error.message);
    res
      .status(500)
      .json({ message: "Failed To Update Profile", success: false });
  }
};

const otpStore = {}; // temporary in-memory store

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if admin exists
    const admin = await UserData.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin email not found" });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // expires in 5 minutes
    };

    console.log(`OTP for ${email}: ${otp}`);

    // Send OTP to email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Gemini Admin Password Reset OTP",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;">
          <h2>Gemini Admin Panel</h2>
          <p>Here is your password reset OTP:</p>
          <h3 style="color:#2E2729;">${otp}</h3>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to admin email",
    });
  } catch (error) {
    console.error("Send OTP Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error while sending OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check OTP
    const record = otpStore[email];
    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found for this email" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > record.expires) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Find admin
    const admin = await UserData.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // Update password (plain text)
    admin.password = newPassword;
    await admin.save();

    // Clear used OTP
    delete otpStore[email];

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error while resetting password",
      });
  }
};

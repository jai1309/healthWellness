import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ActivityLog from "../models/activityLog.model.js";
import { generateAndPersistTokens } from "../services/generatetoken.js";
import {
  errorResponseBody,
  successResponseBody,
} from "../utils/responsebody.js";

import {
  accessTokenOptions,
  refreshTokenOptions,
  cookieOptions,
} from "../services/cookieOptions.js";


// Register Controller
const register = async (req, res) => {
  try {
    const { name, email, password, role, consent_given } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        ...errorResponseBody,
        message: "User with this email already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      consent_given: consent_given ?? false,
    });

    // Log activity
    await ActivityLog.create({
      user_id: user._id,
      action: "REGISTER",
      resource: "User"
    });

    return res.status(201).json({
      ...successResponseBody,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};


// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        ...errorResponseBody,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        ...errorResponseBody,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = await generateAndPersistTokens(
      user._id,
      user.role,
    );

    // Log activity
    await ActivityLog.create({
      user_id: user._id,
      action: "LOGIN",
      resource: "Auth"
    });

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", refreshToken, refreshTokenOptions)
      .json({
        ...successResponseBody,
        message: "Login successful",
        data: {
          accessToken,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};


// Logout Controller
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refresh_token: null });

    // Log activity
    await ActivityLog.create({
      user_id: req.user._id,
      action: "LOGOUT",
      resource: "Auth"
    });

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({
        ...successResponseBody,
        message: "Logged out successfully",
      });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};


// Refresh Token Controller
const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        ...errorResponseBody,
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decoded._id);

    if (!user || user.refresh_token !== incomingRefreshToken) {
      return res.status(401).json({
        ...errorResponseBody,
        message: "Invalid or expired refresh token",
      });
    }

    const { accessToken, refreshToken } = await generateAndPersistTokens(
      user._id,
      user.role,
    );

    // Log activity
    await ActivityLog.create({
      user_id: user._id,
      action: "REFRESH_TOKEN",
      resource: "Auth"
    });

    return res
      .status(200)
      .cookie("accessToken", accessTokenOptions)
      .cookie("refreshToken", refreshTokenOptions)
      .json({
        ...successResponseBody,
        message: "Access token refreshed",
        data: { accessToken },
      });
  } catch (error) {
    return res.status(401).json({
      ...errorResponseBody,
      message: "Token verification failed",
      err: error.message,
    });
  }
};


// Get Current User
const getCurrentUser = async (req, res) => {
  try {

    await ActivityLog.create({
      user_id: req.user._id,
      action: "GET_PROFILE",
      resource: "User"
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "User fetched successfully",
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};


// Update User
const updateUser = async (req, res) => {
  try {
    const { name, consent_given } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, consent_given },
      { new: true },
    ).select("-password_hash -refresh_token");

    await ActivityLog.create({
      user_id: req.user._id,
      action: "UPDATE_PROFILE",
      resource: "User"
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};


// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ...errorResponseBody,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        ...errorResponseBody,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        ...errorResponseBody,
        message: "Incorrect current password",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        ...errorResponseBody,
        message: "New password must be different",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password_hash = hashedPassword;
    user.refresh_token = null;

    await user.save();

    await ActivityLog.create({
      user_id: req.user._id,
      action: "CHANGE_PASSWORD",
      resource: "User"
    });

    res.clearCookie("accessToken", accessTokenOptions);
    res.clearCookie("refreshToken", refreshTokenOptions);

    return res.status(200).json({
      ...successResponseBody,
      message: "Password changed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      ...errorResponseBody,
      err: error.message,
    });
  }
};


export {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  updateUser,
  changePassword,
};
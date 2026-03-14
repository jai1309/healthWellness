import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateTokens = (userId, role) => {

  const accessToken = jwt.sign(
    { _id: userId, role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );

  const refreshToken = jwt.sign(
    { _id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );

  return { accessToken, refreshToken };
};

const generateAndPersistTokens = async (userId, role) => {
  const { accessToken, refreshToken } = generateTokens(userId, role);

  await User.findByIdAndUpdate(
    userId,
    { refresh_token: refreshToken },
    { new: false },
  );

  return { accessToken, refreshToken };
};

export { generateTokens, generateAndPersistTokens };

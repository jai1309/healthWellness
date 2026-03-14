import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponseBody } from "../utils/responsebody.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        ...errorResponseBody,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select(
      "-password_hash -refresh_token",
    );

    if (!user) {
      return res.status(401).json({
        ...errorResponseBody,
        message: "Unauthorized: Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      ...errorResponseBody,
      message: "Unauthorized: Token expired or invalid",
      err: error.message,
    });
  }
};

export { verifyJWT };

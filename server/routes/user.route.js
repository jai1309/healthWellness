import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  updateUser,
  changePassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

const router = Router();

router.post(
  "/register",
  validateBody(["name", "email", "password", "role"]),
  register,
);

router.post("/login", validateBody(["email", "password"]), login);
router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/me", verifyJWT, updateUser);
router.patch("/change-password", verifyJWT, changePassword);

export default router;

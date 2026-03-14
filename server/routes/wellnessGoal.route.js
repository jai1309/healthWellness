import { Router } from "express";
import {
  createWellnessGoal,
  getWellnessGoalsByPatient,
  updateWellnessGoal,
  deleteWellnessGoal,
} from "../controllers/wellnessGoal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/",
  authorizeRoles("patient"),
  validateBody(["goal_type", "target_value"]),
  createWellnessGoal,
);
router.get("/", getWellnessGoalsByPatient);
router.get(
  "/:patientId",
  authorizeRoles("provider"),
  getWellnessGoalsByPatient,
);
router.patch("/:id", authorizeRoles("patient"), updateWellnessGoal);
router.delete("/:id", authorizeRoles("patient"), deleteWellnessGoal);

export default router;

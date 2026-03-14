import { Router } from "express";
import {
  createWellnessLog,
  getWellnessLogsByGoal,
  getWellnessLogsByPatient,
  deleteWellnessLog,
} from "../controllers/wellnessLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/",
  authorizeRoles("patient"),
  validateBody(["goal_id", "value", "log_date"]),
  createWellnessLog,
);
router.get("/goal/:goalId", getWellnessLogsByGoal);
router.get("/patient", getWellnessLogsByPatient);
router.get(
  "/patient/:patientId",
  authorizeRoles("provider"),
  getWellnessLogsByPatient,
);
router.delete("/:id", authorizeRoles("patient"), deleteWellnessLog);

export default router;

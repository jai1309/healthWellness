import { Router } from "express";
import {
  createReminder,
  getRemindersByPatient,
  updateReminder,
  deleteReminder,
} from "../controllers/preventiveReminder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/",
  authorizeRoles("patient"),
  validateBody(["reminder_title", "due_date"]),
  createReminder,
);
router.get("/", getRemindersByPatient);
router.get("/:patientId", authorizeRoles("provider"), getRemindersByPatient);
router.patch("/:id", authorizeRoles("patient"), updateReminder);
router.delete("/:id", authorizeRoles("patient"), deleteReminder);

export default router;

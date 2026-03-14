import { Router } from "express";
import {
  assignPatient,
  getPatientsByProvider,
  getProvidersByPatient,
  removeAssignment,
} from "../controllers/providerPatient.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/assign",
  authorizeRoles("provider"),
  validateBody(["patient_id"]),
  assignPatient,
);
router.get("/patients", authorizeRoles("provider"), getPatientsByProvider);
router.get(
  "/provider/:providerId",
  authorizeRoles("provider"),
  getPatientsByProvider,
);
router.get("/providers/:patientId", getProvidersByPatient);
router.delete("/:id", authorizeRoles("provider"), removeAssignment);

export default router;

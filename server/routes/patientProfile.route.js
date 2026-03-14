import { Router } from "express";
import {
  createPatientProfile,
  getPatientProfile,
  updatePatientProfile,
} from "../controllers/patientProfile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", authorizeRoles("patient"), createPatientProfile);
router.get("/", getPatientProfile);
router.get("/:userId", authorizeRoles("provider"), getPatientProfile);
router.patch("/", authorizeRoles("patient"), updatePatientProfile);

export default router;

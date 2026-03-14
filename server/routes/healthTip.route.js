import { Router } from "express";
import {
 getRandomHealthTip,
} from "../controllers/healthTip.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/random-tip", getRandomHealthTip);

export default router;

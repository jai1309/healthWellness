import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import healthTipRouter from "./routes/healthTip.route.js";
import patientProfileRouter from "./routes/patientProfile.route.js";
import preventiveReminderRouter from "./routes/preventiveReminder.route.js";
import providerPatientRouter from "./routes/providerPatient.route.js";
import wellnessGoalRouter from "./routes/wellnessGoal.route.js";
import wellnessLogRouter from "./routes/wellnessLog.route.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/health-tips", healthTipRouter);
app.use("/api/v1/patient-profile", patientProfileRouter);
app.use("/api/v1/reminders", preventiveReminderRouter);
app.use("/api/v1/provider-patient", providerPatientRouter);
app.use("/api/v1/wellness-goals", wellnessGoalRouter);
app.use("/api/v1/wellness-logs", wellnessLogRouter);

//serevr test route
app.get("/", (req, res) => {
  return res.send("Server Is Running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
import PatientProfile from "../models/patientProfile.model.js";
import ActivityLog from "../models/activityLog.model.js";
import {
  errorResponseBody,
  successResponseBody,
} from "../utils/responsebody.js";

const createPatientProfile = async (req, res) => {
  try {
    const { age, gender, allergies, medications, medical_conditions } =
      req.body;

    const existing = await PatientProfile.findOne({ user_id: req.user._id });
    if (existing) {
      return res.status(409).json({
        ...errorResponseBody,
        message: "Profile already exists for this user",
      });
    }

    const profile = await PatientProfile.create({
      user_id: req.user._id,
      age,
      gender,
      allergies,
      medications,
      medical_conditions,
    });

    // Log activity
    await ActivityLog.create({
      user_id: req.user._id,
      action: "CREATE_PATIENT_PROFILE",
      resource: "PatientProfile",
    });

    return res.status(201).json({
      ...successResponseBody,
      message: "Patient profile created",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const profile = await PatientProfile.findOne({ user_id: userId }).populate(
      "user_id",
      "name email",
    );

    if (!profile) {
      return res.status(404).json({
        ...errorResponseBody,
        message: "Patient profile not found",
      });
    }

    // Log activity
    await ActivityLog.create({
      user_id: req.user._id,
      action: "GET_PATIENT_PROFILE",
      resource: "PatientProfile",
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "Patient profile fetched",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const updatePatientProfile = async (req, res) => {
  try {
    const { age, gender, allergies, medications, medical_conditions } =
      req.body;

    const profile = await PatientProfile.findOneAndUpdate(
      { user_id: req.user._id },
      { age, gender, allergies, medications, medical_conditions },
      { new: true, runValidators: true },
    );

    if (!profile) {
      return res.status(404).json({
        ...errorResponseBody,
        message: "Patient profile not found",
      });
    }

    // Log activity
    await ActivityLog.create({
      user_id: req.user._id,
      action: "UPDATE_PATIENT_PROFILE",
      resource: "PatientProfile",
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "Patient profile updated",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

export { createPatientProfile, getPatientProfile, updatePatientProfile };
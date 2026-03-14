import WellnessLog from "../models/wellnessLog.model.js";
import WellnessGoal from "../models/wellnessGoal.model.js";
import {
  errorResponseBody,
  successResponseBody,
} from "../utils/responsebody.js";

const createWellnessLog = async (req, res) => {
  try {
    const { goal_id, value, log_date } = req.body;

    const goal = await WellnessGoal.findOne({
      _id: goal_id,
      patient_id: req.user._id,
    });
    if (!goal) {
      return res.status(404).json({
        ...errorResponseBody,
        message: "Wellness goal not found or does not belong to you",
      });
    }

    const log = await WellnessLog.create({
      goal_id,
      patient_id: req.user._id,
      value,
      log_date,
    });

    return res.status(201).json({
      ...successResponseBody,
      message: "Wellness log created",
      data: log,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const getWellnessLogsByGoal = async (req, res) => {
  try {
    const logs = await WellnessLog.find({ goal_id: req.params.goalId }).sort({
      log_date: -1,
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "Wellness logs fetched",
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const getWellnessLogsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.user._id;
    const logs = await WellnessLog.find({ patient_id: patientId })
      .populate("goal_id")
      .sort({ log_date: -1 });

    return res.status(200).json({
      ...successResponseBody,
      message: "Wellness logs fetched",
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const deleteWellnessLog = async (req, res) => {
  try {
    const log = await WellnessLog.findOneAndDelete({
      _id: req.params.id,
      patient_id: req.user._id,
    });

    if (!log) {
      return res
        .status(404)
        .json({ ...errorResponseBody, message: "Wellness log not found" });
    }

    return res
      .status(200)
      .json({ ...successResponseBody, message: "Wellness log deleted" });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

export {
  createWellnessLog,
  getWellnessLogsByGoal,
  getWellnessLogsByPatient,
  deleteWellnessLog,
};

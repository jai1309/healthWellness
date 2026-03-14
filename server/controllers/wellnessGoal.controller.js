import WellnessGoal from "../models/wellnessGoal.model.js";
import {
  errorResponseBody,
  successResponseBody,
} from "../utils/responsebody.js";

const createWellnessGoal = async (req, res) => {
  try {
    const { goal_type, target_value } = req.body;

    const goal = await WellnessGoal.create({
      patient_id: req.user._id,
      goal_type,
      target_value,
    });

    return res.status(201).json({
      ...successResponseBody,
      message: "Wellness goal created",
      data: goal,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const getWellnessGoalsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.user._id;
    const goals = await WellnessGoal.find({ patient_id: patientId });

    return res.status(200).json({
      ...successResponseBody,
      message: "Wellness goals fetched",
      data: goals,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const updateWellnessGoal = async (req, res) => {
  try {
    const { goal_type, target_value } = req.body;

    const goal = await WellnessGoal.findOneAndUpdate(
      { _id: req.params.id, patient_id: req.user._id },
      { goal_type, target_value },
      { new: true, runValidators: true },
    );

    if (!goal) {
      return res
        .status(404)
        .json({ ...errorResponseBody, message: "Wellness goal not found" });
    }

    return res.status(200).json({
      ...successResponseBody,
      message: "Wellness goal updated",
      data: goal,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const deleteWellnessGoal = async (req, res) => {
  try {
    const goal = await WellnessGoal.findOneAndDelete({
      _id: req.params.id,
      patient_id: req.user._id,
    });

    if (!goal) {
      return res
        .status(404)
        .json({ ...errorResponseBody, message: "Wellness goal not found" });
    }

    return res
      .status(200)
      .json({ ...successResponseBody, message: "Wellness goal deleted" });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

export {
  createWellnessGoal,
  getWellnessGoalsByPatient,
  updateWellnessGoal,
  deleteWellnessGoal,
};

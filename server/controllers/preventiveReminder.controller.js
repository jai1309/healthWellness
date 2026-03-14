import PreventiveReminder from "../models/preventiveReminder.model.js";
import ActivityLog from "../models/activityLog.model.js";
import {
  errorResponseBody,
  successResponseBody,
} from "../utils/responsebody.js";

const createReminder = async (req, res) => {
  try {
    const { reminder_title, description, due_date } = req.body;

    const reminder = await PreventiveReminder.create({
      patient_id: req.user._id,
      reminder_title,
      description,
      due_date,
    });

    await ActivityLog.create({
      user_id: req.user._id,
      action: "CREATE_REMINDER",
      resource: "PreventiveReminder",
    });

    return res.status(201).json({
      ...successResponseBody,
      message: "Reminder created",
      data: reminder,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const getRemindersByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.user._id;

    const reminders = await PreventiveReminder.find({
      patient_id: patientId,
    }).sort({ due_date: 1 });

    await ActivityLog.create({
      user_id: req.user._id,
      action: "GET_REMINDERS",
      resource: "PreventiveReminder",
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "Reminders fetched",
      data: reminders,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    const { reminder_title, description, due_date, status } = req.body;

    const reminder = await PreventiveReminder.findOneAndUpdate(
      { _id: req.params.id, patient_id: req.user._id },
      { reminder_title, description, due_date, status },
      { new: true, runValidators: true },
    );

    if (!reminder) {
      return res
        .status(404)
        .json({ ...errorResponseBody, message: "Reminder not found" });
    }

    await ActivityLog.create({
      user_id: req.user._id,
      action: "UPDATE_REMINDER",
      resource: "PreventiveReminder",
    });

    return res.status(200).json({
      ...successResponseBody,
      message: "Reminder updated",
      data: reminder,
    });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const reminder = await PreventiveReminder.findOneAndDelete({
      _id: req.params.id,
      patient_id: req.user._id,
    });

    if (!reminder) {
      return res
        .status(404)
        .json({ ...errorResponseBody, message: "Reminder not found" });
    }

    await ActivityLog.create({
      user_id: req.user._id,
      action: "DELETE_REMINDER",
      resource: "PreventiveReminder",
    });

    return res
      .status(200)
      .json({ ...successResponseBody, message: "Reminder deleted" });
  } catch (error) {
    return res.status(500).json({ ...errorResponseBody, err: error.message });
  }
};

export {
  createReminder,
  getRemindersByPatient,
  updateReminder,
  deleteReminder,
};
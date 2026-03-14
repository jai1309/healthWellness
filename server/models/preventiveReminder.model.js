import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
{
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reminder_title: {
    type: String,
    required: true
  },
  description: String,
  due_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "missed"],
    default: "pending"
  }
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("PreventiveReminder", reminderSchema);
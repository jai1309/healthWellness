import mongoose from "mongoose";

const wellnessLogSchema = new mongoose.Schema(
{
  goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WellnessGoal",
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  log_date: {
    type: Date,
    required: true
  }
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("WellnessLog", wellnessLogSchema);    
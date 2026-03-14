import mongoose from "mongoose";

const wellnessGoalSchema = new mongoose.Schema(
{
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  goal_type: {
    type: String,
    enum: ["steps", "water", "sleep"],
    required: true
  },
  target_value: {
    type: Number,
    required: true
  }
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("WellnessGoal", wellnessGoalSchema);
import mongoose from "mongoose";

const healthTipSchema = new mongoose.Schema(
{
  tip_id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("HealthTip", healthTipSchema);
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
{
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    required: true
  },
  resource: String
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("ActivityLog", activityLogSchema);
import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema(
{
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  age: Number,
  gender: String,
  allergies: String,
  medications: String,
  medical_conditions: String
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("PatientProfile", patientProfileSchema);
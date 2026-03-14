import mongoose from "mongoose";

const providerPatientSchema = new mongoose.Schema(
{
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assigned_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ProviderPatient", providerPatientSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["patient", "provider"],
    required: true
  },
  consent_given: {
    type: Boolean,
    default: false
  },

  refresh_token: {
    type: String,
    default: null
  }
},
{ timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("User", userSchema);
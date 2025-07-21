import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."]
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function () {
      return !(this.role === "Doctor" && this.status === "Pending");
    }
  },
  role: {
    type: String,
    enum: ["Patient", "Doctor", "Admin"],
    default: "Patient"
  },
  specialization: {
    type: String
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerifyToken: String,
  emailVerifyExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);
export default User;

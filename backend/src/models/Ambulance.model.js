import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    patientName: String,
    location: String,
    contactNumber: String,
    emergencyType: String,

    status: {
      type: String,
      enum: ["REQUESTED", "DISPATCHED", "COMPLETED"],
      default: "REQUESTED",
      index: true,
    },
  },
  { timestamps: true }
);

const AmbulanceBooking = mongoose.model("AmbulanceBooking", ambulanceSchema);
export default AmbulanceBooking;

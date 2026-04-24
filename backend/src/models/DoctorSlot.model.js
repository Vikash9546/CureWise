import mongoose from "mongoose";

const doctorSlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      index: true,
    },

    startTime: { type: Date, index: true },
    endTime: Date,

    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DoctorSlot = mongoose.model("DoctorSlot", doctorSlotSchema);
export default DoctorSlot;

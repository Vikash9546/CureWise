import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, index: true },
    experience: Number,
    consultancyFee: Number,
    rating: { type: Number, default: 4.5 },

    hospitalName: String,
    city: { type: String, index: true },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number], // [lng, lat]
    },
  },
  { timestamps: true }
);

doctorSchema.index({ location: "2dsphere" });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;

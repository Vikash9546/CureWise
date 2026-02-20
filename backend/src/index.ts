import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import doctorRoutes from "./routes/doctor.routes";
import ambulanceRoutes from "./routes/ambulance.routes";
import meetingRoutes from "./routes/meeting.routes";

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/meetings", meetingRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

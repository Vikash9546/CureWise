import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import ambulanceRoutes from "./routes/ambulance.routes.js";
// import meetingRoutes from "./routes/meeting.routes.js";
import communityRoutes from "./routes/community.routes.js";
import wellnessRoutes from "./routes/wellness.routes.js";

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/ambulance", ambulanceRoutes);
// app.use("/api/meetings", meetingRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/wellness", wellnessRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

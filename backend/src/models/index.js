import User from "./User.model.js";
import Doctor from "./Doctor.model.js";
import DoctorSlot from "./DoctorSlot.model.js";
import Appointment from "./Appointment.model.js";
import Ambulance from "./Ambulance.model.js";
import Post from "./Post.model.js";
import Comment from "./Comment.model.js";
import Like from "./Like.model.js";
import Wellness from "./Wellness.model.js";
import PointLog from "./PointLog.model.js";

const store = {
    user: User,
    doctor: Doctor,
    doctorSlot: DoctorSlot,
    appointment: Appointment,
    ambulance: Ambulance,
    post: Post,
    comment: Comment,
    like: Like,
    wellness: Wellness,
    pointLog: PointLog
};

export default store;
export {
    User,
    Doctor,
    DoctorSlot,
    Appointment,
    Ambulance,
    Post,
    Comment,
    Like,
    Wellness,
    PointLog
};

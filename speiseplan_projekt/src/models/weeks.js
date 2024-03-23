import mongoose, { Schema } from "mongoose";

const weeksSchema = new Schema({
    "week-number": {
        type: Number,
        required: true,
    },
    "year": {
        type: Number,
        required: true
    }
});

const Weeks = mongoose.models.Weeks || mongoose.model("Weeks", weeksSchema);
export default Weeks;
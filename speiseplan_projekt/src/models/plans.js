import mongoose, {Schema} from "mongoose";

const planSchema = new Schema({
    "week-id": {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    "day-number": {
        type: Number,
        required: true,
    },
    "meal-ids": {
        type: [Number],
        required: true
    }
});


const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);
export default Plan;
import mongoose, { Schema } from "mongoose";

// Definiere das Schema für Pläne
const planSchema = new Schema({
    "week-id": {
        type: Number,
    },
    "day-number": {
        type: Number,
    },
    "meal-ids": [{
        type: Schema.Types.ObjectId, 
        ref: 'Meal' 
    }]
});

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);

export default Plan;



import mongoose, { Schema } from "mongoose";

// Definiere das Schema für Pläne
const planSchema = new Schema({
    "weekId": {
        type: Number,
    },
    "dayNumber": {
        type: Number,
    },
    "mealIds": [{
        type: Schema.Types.ObjectId, 
        ref: 'Meal' 
    }]
});

const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);

export default Plan;



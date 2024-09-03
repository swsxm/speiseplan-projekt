import mongoose, {Schema} from "mongoose";

const mealSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    }
});

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);
export default Meal;
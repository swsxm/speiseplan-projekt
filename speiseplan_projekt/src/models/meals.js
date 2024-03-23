import mongoose, {Schema} from "mongoose";

const mealSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Beschreibung: {
        type: String,
        required: true,
    },
    link_fur_image: {
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
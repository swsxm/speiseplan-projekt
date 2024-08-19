import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    "user-id": {
        type: Number,
        required: true,
    },
    "date": {
        type: Date,
        required: true,
    },
    "orderedMeals": [{
        mealId: {
            type: Schema.Types.ObjectId, // Referenziert das Meal-Schema
            ref: 'meals',

        },
        quantity: {
            type: Number,

        },
        date: {
            type: Date,
        },
        day: {
            type: String,
        }
    }],
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;

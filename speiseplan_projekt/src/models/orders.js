import mongoose, {Schema} from "mongoose";

const orderSchema = new Schema({
    "user-id": {
        type: Number,
        required: true,
    },
    "date": {
        type: Date,
        required: true,
    },
    "orderedMeals": {
        type: [{
            id: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
            ,
            day: {
                type: String,
                required: true
            }
        }],
        required: true
    }
});


const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
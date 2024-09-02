import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import { verifyUser } from "../../../lib/verifyToken";

export async function POST(req) {
    /**
     * Handle updating or removing ordered meals for a user on a specific date
     */
    try {
        const check = await verifyUser(req);
        if (check instanceof NextResponse) {
            return check;
        }
        const payload = check;

        const { updatedMeals, userId, date } = await req.json();
        const targetDate = new Date(date);

        /**
         * Validate the date
         */
        if (isNaN(targetDate.getTime())) {
            return NextResponse.json({ message: "Invalid date provided." }, { status: 400 });
        }
        targetDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 for accurate date matching

        await connectMongoDB();

        /**
         * Find all orders for the user and date
         */
        const orders = await Order.find({
            "user-id": userId,
            "orderedMeals.date": targetDate
        });

        if (orders.length === 0) {
            console.log("No orders found for the provided date and user.");
            return NextResponse.json({ message: "No orders found for the provided date and user." }, { status: 404 });
        }

        console.log("Original orders:", orders);

        /**
         * Iterate through the updatedMeals to either update quantity or delete the orderedMeal
         */
        for (const updatedMeal of updatedMeals) {
            if (updatedMeal.quantity < 0) {
                return NextResponse.json({ message: "Invalid quantity provided." }, { status: 400 });
            }

            for (const order of orders) {
                const mealToUpdate = order.orderedMeals.id(updatedMeal.orderMealId);

                if (mealToUpdate) {
                    if (updatedMeal.quantity > 0) {
                        console.log(`Updating meal ${mealToUpdate._id} to quantity ${updatedMeal.quantity}`);
                        mealToUpdate.quantity = updatedMeal.quantity;
                    } else {
                        console.log(`Removing meal ${mealToUpdate._id} as quantity is 0`);
                        order.orderedMeals.pull({ _id: updatedMeal.orderMealId });
                    }
                } else {
                    console.log(`Meal ${updatedMeal.orderMealId} not found in order.`);
                }

                /**
                 * If orderedMeals is empty after update, remove the entire order
                 */
                if (order.orderedMeals.length === 0) {
                    console.log(`No meals left in order ${order._id}. Deleting the order.`);
                    await Order.findByIdAndDelete(order._id);
                } else {
                    await order.save();
                }
            }
        }

        console.log("Updated orders:", orders);

        return NextResponse.json({ message: "Orders updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error updating orders:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

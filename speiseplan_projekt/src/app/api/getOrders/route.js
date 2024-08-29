import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from '@/models/orders';
import Meal from "@/models/meals";

export async function POST(req) { 
    /**
     * Handle the request to fetch meals for a given user and date
     */
    try {
        await connectMongoDB();

        const { date: dateString, userId } = await req.json();

        /**
         * Validate the date
         */
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return NextResponse.json({ message: "Invalid date provided." }, { status: 400 });
        }

        /**
         * Set the time of the date to 00:00:00 to search only by day
         */
        date.setUTCHours(0, 0, 0, 0);

        /**
         * Find orders for the user and date
         */
        const orders = await Order.find({
            "user-id": userId,
            "orderedMeals.date": date
        });

        if (orders.length === 0) {
            return NextResponse.json({ message: "No orders found for this user and date." }, { status: 200 });
        }

        /**
         * Extract all mealIds, quantities, and _id from the orders
         */
        const orderedMeals = orders.flatMap(order => 
            order.orderedMeals.map(meal => ({
                _id: meal._id, 
                mealId: meal.mealId,
                quantity: meal.quantity
            }))
        );

        /**
         * Fetch corresponding Meal documents from the meals collection
         */
        const mealIds = orderedMeals.map(meal => meal.mealId);
        const meals = await Meal.find({ _id: { $in: mealIds } });

        /**
         * Add quantity and _id to the meal documents
         */
        const mealsWithQuantity = meals.map(meal => {
            const correspondingOrder = orderedMeals.find(om => om.mealId.toString() === meal._id.toString());
            return {
                ...meal.toObject(),
                quantity: correspondingOrder ? correspondingOrder.quantity : 0,
                orderMealId: correspondingOrder ? correspondingOrder._id : null
            };
        });

        /**
         * Return the meals with quantity and _id as JSON
         */
        return NextResponse.json(mealsWithQuantity, { status: 200 });
    } catch (error) {
        console.error("Error fetching meals:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

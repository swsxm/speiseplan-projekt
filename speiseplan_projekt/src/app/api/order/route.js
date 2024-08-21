import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import Meal from "@/models/plans";
import { verifyAuth } from "@/lib/verifyToken";

// Function to calculate the week number for a given date
function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    // Calculate the week number (ISO week date standard)
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }
        const payload = await verifyAuth(token);

        // Extract required information from the request
        const { ordered_meals_id } = await req.json();
        const date = new Date();

        // Connect to MongoDB
        await connectMongoDB();

        // Create the order in the database
        await Order.create({
            "user-id": payload.id,
            "date": date,
            "orderedMeals": ordered_meals_id.map(item => ({
                id: item.type,
                quantity: item.quantity,
                day: item.day,
                mealId: item._id
            }))
        });

        // Success message
        return NextResponse.json({ status: 201, message: "Order created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}

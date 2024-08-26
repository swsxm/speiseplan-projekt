import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import { verifyUser }from "../../../lib/verifyToken"

export async function POST(req) {
    try {
        const check = await verifyUser(req)
        if (check instanceof NextResponse) {
            return check
        }
        const payload = check;

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

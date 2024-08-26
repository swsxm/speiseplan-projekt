import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import { startOfWeek, endOfWeek } from 'date-fns';
import { verifyAdmin } from "../../../lib/verifyToken";

export async function GET(req, res) {
    try {
        const check = await verifyAdmin(req)
        if (check instanceof NextResponse) {
            return check
        }

        await connectMongoDB();

        const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
        /*  Query to Aggregate of the Meals that were ordered this week
            (for the next Week) */
        const ordersWithMealAggregation = await Order.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfCurrentWeek,
                        $lte: endOfCurrentWeek
                    }
                }
            },
            {
                $unwind: "$orderedMeals"
            },
            {
                $project: {
                    _id: 1,
                    "user-id": 1,
                    date: 1,
                    quantity: "$orderedMeals.quantity",
                    mealDate: "$orderedMeals.date",
                    mealDay: "$orderedMeals.day",
                    mealId: "$orderedMeals.mealId"
                }
            },
            // Join the meals
            {
                $lookup: {
                    from: "meals",
                    foreignField: "_id",
                    localField: "mealId",
                    as: "mealDetails"
                }
            },
            {
                $unwind: "$mealDetails"
            },
            /* group the meals with the mealId */
            {
                $group: {
                    _id: "$mealId",
                    totalQuantity: { $sum: "$quantity" },
                    totalPrice: { $sum: { $multiply: ["$quantity", "$mealDetails.price"] } },
                    mealName: { $first: "$mealDetails.name" },
                    mealDescription: { $first: "$mealDetails.description" },
                    mealType: { $first: "$mealDetails.type" },
                    mealImage: { $first: "$mealDetails.image" }
                }
            },
            {
                $project: {
                    _id: 0,
                    mealId: "$_id",
                    totalQuantity: 1,
                    totalPrice: 1,
                    mealName: 1,
                    mealDescription: 1,
                    mealType: 1,
                    mealImage: 1
                }
            }
        ]);

        return NextResponse.json({ orders: ordersWithMealAggregation }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

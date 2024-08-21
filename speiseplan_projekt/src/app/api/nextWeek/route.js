import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import Meal from "@/models/meals";
import { verifyAuth } from "@/lib/verifyToken";
import { NextResponse } from "next/server";
import { getWeek, startOfWeek, endOfWeek } from 'date-fns';


export async function GET(req, res) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }

        const payload = await verifyAuth(token);
        if (!payload.admin) {
            return NextResponse.json({ status: 403, message: "Forbidden" });
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
                        mealName: { $first: "$mealDetails.Name" }, 
                        mealDescription: { $first: "$mealDetails.Beschreibung" }, 
                        mealType: { $first: "$mealDetails.type" },
                        mealImage: { $first: "$mealDetails.link_fur_image" } 
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
            
        return NextResponse.json({ status: 200, orders: ordersWithMealAggregation });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}

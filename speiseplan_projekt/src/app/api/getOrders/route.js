import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import { verifyUser } from "../../../lib/verifyToken";

export async function POST(req) {
    /**
     * Fetch meals for a given user and date
     */
    try {
        const check = await verifyUser(req);
        if (check instanceof NextResponse) {
            return check;
        }
        const payload = check;

        const { date: dateString, userId } = await req.json();
        const date = new Date(dateString);

        /**
         * Validate the date and set the time to 00:00:00 to search only by day
         */
        if (isNaN(date.getTime())) {
            return NextResponse.json({ message: "Invalid date provided." }, { status: 400 });
        }
        date.setUTCHours(0, 0, 0, 0);
        await connectMongoDB();

        /**
         * Perform an aggregate query to join orders with their respective meals
         */
        const ordersWithMeals = await Order.aggregate([
            {
                $match: {
                    "userId": payload.id
                }
            },
            {
                $unwind: "$orderedMeals"
            },
            {
                $match: {
                    "orderedMeals.date": date
                }
            },
            {
                $lookup: {
                    from: "meals",
                    localField: "orderedMeals.mealId",
                    foreignField: "_id",
                    as: "mealDetails"
                }
            },
            {
                $unwind: "$mealDetails"
            },
            {
                $project: {
                    orderMealId: "$orderedMeals._id",
                    quantity: "$orderedMeals.quantity",
                    day: "$orderedMeals.day",
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$orderedMeals.date"
                        }
                    },
                    _id: "$orderedMeals.mealId",
                    name: "$mealDetails.name",
                    description: "$mealDetails.description",
                    price: "$mealDetails.price",
                    image: "$mealDetails.image",
                    type: "$mealDetails.type"
                }
            }
        ]);

        if (ordersWithMeals.length === 0) {
            return NextResponse.json({ message: "No orders found for this user and date." }, { status: 200 });
        }

        /**
         * Return the combined data as JSON
         */
        return NextResponse.json(ordersWithMeals, { status: 200 });
    } catch (error) {
        console.error("Error fetching meals:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Plans from "@/models/plans";
import { getWeek } from 'date-fns';
import { verifyAdmin }from "../../../lib/verifyToken"

export async function POST(req) {
    try {
        const check = await verifyAdmin(req)
        if (check instanceof NextResponse) {
            return check
        }

        await connectMongoDB();

        // Extract date and type from request
        const { date, type } = await req.json();
        
        // Get week number and day of the week
        const weekNumber = getWeek(new Date(date), { weekStartsOn: 1 });
        const dayOfWeek = new Date(date).getDay();

        // Aggregation pipeline
        const pipeline = [
            { $match: { "weekId": weekNumber, "dayNumber": dayOfWeek } },
            { 
                $lookup: {
                    from: "meals",
                    localField: "mealIds",
                    foreignField: "_id",
                    as: "meals"
                }
            },
            { $unwind: "$meals" },
            { $match: { "meals.type": type } },
            { $replaceRoot: { newRoot: "$meals" } }
        ];

        // Execute aggregation
        const meals = await Plans.aggregate(pipeline).exec();
        return NextResponse.json(Array.isArray(meals) ? meals : []);

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

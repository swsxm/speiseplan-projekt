import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Meals from "@/models/meals";
import Plans from "@/models/plans";
import mongoose from 'mongoose';
import { getWeek } from 'date-fns';

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }
        const payload = await verifyAuth(token);
        if(payload.admin == false){
            return NextResponse.json({ status: 403, message: "Not an admin" });
        }

        await connectMongoDB();

        // Extract date and type from request
        const { date, type } = await req.json();
        
        // Get week number and day of the week
        const weekNumber = getWeek(new Date(date), { weekStartsOn: 1 });
        const dayOfWeek = new Date(date).getDay();

        // Aggregation pipeline
        const pipeline = [
            { $match: { "week-id": weekNumber, "day-number": dayOfWeek } },
            { 
                $lookup: {
                    from: "meals",
                    localField: "meal-ids",
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

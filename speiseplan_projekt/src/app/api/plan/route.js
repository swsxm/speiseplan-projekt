"@/models/plans";
import Meal from "@/models/meals";
import Order from "@/models/orders";
import Plan from "@/models/plans"
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();
        
        // Parse the request JSON to get the date
        const { date: dateString } = await req.json();
        const date = new Date(dateString);
        // Calculate week number and year from the provided date
        const weekNumber = getWeekNumber(date);
        const dayNumber = date.getDay();

        // Find the plan for the given week and day
        const plan = await Plan.findOne({ "week-id": weekNumber, "day-number": dayNumber }).populate('meal-ids').exec();
        if (!plan) {
            console.log('kein plan')
            return NextResponse.json({ message: "Plan not found" }, { status: 200 });
        }

        // Extract meal IDs from the plan and retrieve meal details
        const mealIds = plan['meal-ids'];
        const mealPromises = mealIds.map(meal => Meal.findById(meal).exec());
        
        // Fetch all meal details
        const meals = await Promise.all(mealPromises);
        return NextResponse.json(meals, { status: 200 });
    } catch (e) {
        console.error("Error processing request:", e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// Function to calculate the week number from a given date
function getWeekNumber(datum) {
    const target = new Date(datum.valueOf());
    const dayNumber = (datum.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}
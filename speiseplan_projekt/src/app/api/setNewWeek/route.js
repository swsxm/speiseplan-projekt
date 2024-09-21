import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Plan from "@/models/plans";
import { getISOWeek } from 'date-fns';
import { verifyAdmin }from "../../../lib/verifyToken"

export async function POST(req) {
    try {
        const check = await verifyAdmin(req)
        if (check instanceof NextResponse) {
            return check
        }

        await connectMongoDB();

        const currentDate = new Date();
        const week_number = getISOWeek(currentDate) + 2;

        // Check if plans for the week already exist
        const existingPlans = await Plan.find({ "weekId": week_number }).exec();

        if (existingPlans.length > 0) {
            console.log(`Plans for week ${week_number} already exist in the database.`);
            return NextResponse.json({ week_number }, { status: 200 });
        }

        // If no plans exist, create a document for each day
        const days = [1, 2, 3, 4, 5, 6];
        const newPlans = await Promise.all(days.map(day => 
            Plan.create({
                "weekId": week_number,
                "dayNumber": day,
                "mealIds": []
            })
        ));

        console.log(`New plans for week ${week_number} created.`);

        return NextResponse.json({ week_number }, { status: 201 });
    } catch (e) {
        console.error("Error creating plans:", e.message);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

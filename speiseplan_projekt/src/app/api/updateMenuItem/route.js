import { NextResponse } from "next/server";
import Plan from "@/models/plans";
import { connectMongoDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/verifyToken";
import mongoose from 'mongoose';
import { getWeek } from 'date-fns';

export async function POST(req) {
    try {
        
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }

        const payload = await verifyAuth(token);
        if (!payload.admin) {
            return NextResponse.json({ status: 403, message: "Not an admin" });
        }

        const { item, selectedDay, itemToUpdate } = await req.json();
        const date = new Date(selectedDay);
        const dayNumber = date.getDay();
        const weekNumber = getWeek(date, { weekStartsOn: 1 });

        await connectMongoDB();

        const newItemId = new mongoose.Types.ObjectId(item._id);

        if (itemToUpdate && itemToUpdate.length > 0 && itemToUpdate[0]._id) {
            const itemToUpdateId = new mongoose.Types.ObjectId(itemToUpdate[0]._id);

            /* Find and update the Plan with the new Meal */
            const updatedPlan = await Plan.findOneAndUpdate(
                { "week-id": weekNumber, "day-number": dayNumber, "meal-ids": itemToUpdateId },
                { $set: { "meal-ids.$[elem]": newItemId } },
                { 
                    arrayFilters: [{ "elem": itemToUpdateId }], 
                    new: true 
                }
            );

            if (!updatedPlan) {
                return NextResponse.json({ status: 404, message: "Failed to update Plan or Plan not found" });
            }

            return NextResponse.json({ status: 201, message: "Meal replaced successfully", plan: updatedPlan });

        } else {
            const updatedPlan = await Plan.findOneAndUpdate(
                { "week-id": weekNumber, "day-number": dayNumber },
                { $push: { "meal-ids": newItemId } },
                { new: true }
            );
            if (!updatedPlan) {
                return NextResponse.json({ status: 404, message: "Failed to update Plan or Plan not found" });
            }

            return NextResponse.json({ status: 201, message: "Meal added successfully", plan: updatedPlan });
        }

    } catch (error) {
        console.error("Error updating meal:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}

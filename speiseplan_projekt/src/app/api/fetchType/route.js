import Meals from "@/models/meals";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();
        const type = await req.json();
        const meals = await Meals.find({ "type": type }).exec();

        return NextResponse.json(meals, { status: 201 });
    } catch (e) {
        return NextResponse.json(
            { message: e },
            { status: 500 }
        );
    }
}
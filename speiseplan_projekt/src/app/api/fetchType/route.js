import Meals from "@/models/meals";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();

        const { type } = await req.json();

        // Find meals of the specified type
        const mealsFromDb = await Meals.find({ "type": type }).exec();
        
        // Convert data to MenuItem format
        const menuItems = mealsFromDb.map(meal => ({
            _id: meal._id.toString(),  // Convert MongoDB ObjectId to string
            name: meal.Name,
            description: meal.Beschreibung,
            price: meal.price,
            imageUrl: meal.link_fur_image,
            type: meal.type
        }));

        return NextResponse.json(menuItems, { status: 200 });
    } catch (e) {
        // Return error message
        return NextResponse.json(
            { message: e.message },
            { status: 500 }
        );
    }
}

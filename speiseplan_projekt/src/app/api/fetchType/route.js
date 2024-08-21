import Meals from "@/models/meals";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

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

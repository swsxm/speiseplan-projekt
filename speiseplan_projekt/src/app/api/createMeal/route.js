import { NextResponse } from "next/server";
import Meal from "@/models/meals"
import { connectMongoDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/verifyToken";

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
        const   data  = await req.json();
        await connectMongoDB();

        const highestIdMeal = await Meal.findOne().sort({ id: -1 });
        const newId = highestIdMeal ? highestIdMeal.id + 1 : 1;

        const newMeal = new Meal({
            id: newId,
            Name: data.newMeal.Name,
            Beschreibung: data.newMeal.Beschreibung,
            link_fur_image: data.newMeal.link_fur_image,
            type: data.newMeal.type,
            price: data.newMeal.price
        });

        await newMeal.save();
        return NextResponse.json({ status: 201, message: "Meal created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
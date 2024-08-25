import { NextResponse } from "next/server";
import Meal from "@/models/meals"
import { connectMongoDB } from "@/lib/mongodb";
import { validateLength, validateFloat, validateUrl } from "../../../lib/validationHelpers";
import { verifyAdmin }from "../../../lib/verifyToken"


function validateType(type) {
/**
 * Validate the Menu Type
 */
    const validTypes = ['Menu1', 'Menu2', 'Suppe', 'Nachtisch']
    if (validTypes.includes(type)) {
        return null;
    }
    return 'Type is not valid'
}


async function handleValidationErrors(mealName, mealDescription, mealUrl, mealType, mealPrice) {
/**
 * Helper function to give back an error
 */
    const errors = {
        description: validateLength(mealDescription, 1, 255),
        type: validateType(mealType),
        url: validateUrl(mealUrl),
        name: validateLength(mealName, 1, 64),
        price: validateFloat(mealPrice, 1, 8),
    };

    for (const [field, error] of Object.entries(errors)) {
        if (error) return { status: 400, error: error };
    }
    return null;
}


export async function POST(req) {
/**
 * This function takes a post request and validates if the
 * request to create a meal is legit
 */
    try {
        
        const check = await verifyAdmin(req)
        if (check instanceof NextResponse) {
            return check
        }

        const data = await req.json();
        const mealName = data.newMeal.Name
        const mealDescription = data.newMeal.Beschreibung
        const mealUrl = data.newMeal.link_fur_image
        const mealType = data.newMeal.type
        const mealPrice = data.newMeal.price

        const validationError = await handleValidationErrors(mealName, mealDescription, mealUrl, mealType, mealPrice);
        if (validationError) {
            return NextResponse.json(validationError);
        }

        await connectMongoDB();
        

        const newMeal = new Meal({
            Name: mealName,
            Beschreibung: mealDescription,
            link_fur_image: mealUrl,
            type: mealType,
            price: mealPrice 
        });

        await newMeal.save();
        return NextResponse.json({ status: 201, message: "Meal created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
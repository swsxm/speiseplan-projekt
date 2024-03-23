import Plan from "@/models/plans"
import Meals from "@/models/meals"
import Weeks from "@/models/weeks"
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb"

export async function POST(req) {
    try {
        await connectMongoDB();
        const date_string = await req.json();

        console.log(date_string);
        var date = new Date(date_string.date);
        var week_number = getWeekNumber(date);
        var year = date.getFullYear();

        var day_number = date.getDay();

        console.log("Woche im Jahr:", week_number);
        console.log("Jahr:", year);
        console.log("Tag in der Woche:", day_number);

        let week_id = await Weeks.find({"week-number": week_number, "year" : year}).select("_id");
        let meal_ids = await Plan.findOne({"week-id": week_id, "day-number" : day_number}).select("meal-ids");

        const mealPromises = meal_ids['meal-ids'].map(async element => {
            const meal = await Meals.find({ "id": element });
            return meal;
        });
        
        const meals = await Promise.all(mealPromises);
        return NextResponse.json(meals, { status: 201 });
    }
    catch (e) {

        return NextResponse.json(
            { message: e },
            { status: 500 }
        )

    }
}
function getWeekNumber(datum) {
    var target = new Date(datum.valueOf());
    var dayNumber = (datum.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}
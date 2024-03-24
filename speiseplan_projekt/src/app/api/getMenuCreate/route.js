import Meals from "@/models/meals";
import Plans from "@/models/plans";
import Weeks from "@/models/weeks";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();
        
        // Extrahiere das Datum und den Typ aus dem Anfrageobjekt
        const { date, type } = await req.json();
        
        // Ermittle die Kalenderwoche aus dem Datum
        const weekNumber = getWeekNumber(new Date())+2;
        console.log(weekNumber);
        
        // Suche nach der Wochen-ID in der Tabelle 'weeks'
        const week = await Weeks.findOne({ "week-number" : weekNumber }).exec();
        console.log(week);

        if (!week) {
            return NextResponse.json(
                { message: "Keine Daten gefunden für die angegebene Woche." },
                { status: 404 }
            );
        }
        // Extrahiere den Plan anhand der Wochen-ID und des Wochentags
        const dayOfWeek = new Date(date).getDay();
       
        console.log("type: ",type);
        // Extrahiere die Meal-ID basierend auf dem Typ aus dem gefundenen Plan
        let typeId;
        if (type == "Menu1") {
            typeId = 0;
        } else if (type == "Menu2") {
            typeId = 1;
        } else if (type == "Nachtisch") {
            typeId = 2;
        } else if (type == "Suppe") {
            typeId = 3;
        } else {
            console.log("Typ-ID nicht korrekt");
            return NextResponse.json(
                { message: "Typ-ID nicht korrekt" },
                { status: 400 }
            );
        }
        const plan = await Plans.findOne({ "week-id": week._id, "day-number": dayOfWeek }).exec();
        let mealIds = plan["meal-ids"]; // meal-ids ist ein Array von Meal-IDs
        
        // Wähle die Meal-ID basierend auf typeId
        let mealId = mealIds[typeId];        // Suche in der Tabelle 'meals' nach den Mahlzeiten basierend auf der Meal-ID
        console.log(mealId);
        const meal = await Meals.find({ id: mealId }).exec();
        return NextResponse.json(meal, { status: 200 });
        
    } catch (e) {
        return NextResponse.json(
            { message: e },
            { status: 500 }
        );
    }
}

function getWeekNumber(date) {
    const target = new Date(date);
    const dayNumber = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}
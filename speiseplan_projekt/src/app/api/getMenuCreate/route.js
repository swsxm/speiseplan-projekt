import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Meals from "@/models/meals";
import Plans from "@/models/plans";
import mongoose from 'mongoose';
import { getWeek } from 'date-fns';

export async function POST(req) {
    console.log('-----------------------------')
    try {
        await connectMongoDB();

        // Extrahiere das Datum und den Typ aus dem Anfrageobjekt
        const { date, type } = await req.json();
        
        // Ermittle die Kalenderwoche aus dem Datum
        const weekNumber = getWeek(new Date(date), { weekStartsOn: 1 });
        console.log('Week Number:', weekNumber);

        // Extrahiere den Plan anhand der Kalenderwoche und des Wochentags
        const dayOfWeek = new Date(date).getDay(); // 0 (Sonntag) bis 6 (Samstag)

        // Aggregationspipeline, um Plan zu finden und die entsprechenden Mahlzeiten zu holen
        const pipeline = [
            // Schritt 1: Filtert Pläne nach Kalenderwoche und Tag
            {
                $match: { "week-id": weekNumber, "day-number": dayOfWeek }
            },
            // Schritt 2: Führt einen Lookup mit der meals-Sammlung durch
            {
                $lookup: {
                    from: "meals",
                    localField: "meal-ids",
                    foreignField: "_id",
                    as: "meals"
                }
            },
            // Schritt 3: Entpackt das meals-Array in separate Dokumente
            {
                $unwind: "$meals"
            },
            // Schritt 4: Filtert Mahlzeiten nach dem Typ
            {
                $match: { "meals.type": type }
            },
            // Schritt 5: Ersetzt die Wurzel des Dokuments durch das meals-Dokument
            {
                $replaceRoot: { newRoot: "$meals" }
            }
        ];

        // Führe die Aggregation aus
        const meals = await Plans.aggregate(pipeline).exec();
        // Sicherstellen, dass die Antwort ein Array ist
        return NextResponse.json(Array.isArray(meals) ? meals : []);

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

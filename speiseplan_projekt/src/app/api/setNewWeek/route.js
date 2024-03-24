import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Weeks from "@/models/weeks";
import Plan from "@/models/plans";

export async function POST(req) {
    try {
        // Füge eine zufällige Wartezeit von 0 bis 2000 Millisekunden hinzu um zu warten. Zum vermeiden von doppeltem eintrag in DB
        const sleepTime = Math.floor(Math.random() * 2000);
        await sleep(sleepTime);
        await connectMongoDB();
        
        const week_number = getWeekNumber(new Date()) + 2; // Berechne die Kalenderwoche

        const existingWeek = await Weeks.findOne({ "week-number": week_number }).exec();
        
        console.log(week_number);

        if (!existingWeek) {
            console.log(`Woche ${week_number} existiert nicht in der Datenbank.`);
            // Neue Woche erstellen
            try {
                await Weeks.create({
                    "week-number": week_number,
                    "year": new Date().getFullYear() // Jahr der aktuellen Woche
                });
            
            } catch (error) {
                console.error("Fehler beim Speichern der Woche:", error);
                throw new Error("Fehler beim Speichern der Woche");
            }

            // Erstellen Sie Einträge in der Plan-Tabelle für die neue Woche
            const newWeek = await Weeks.findOne({ "week-number": week_number }).exec();
            const weekId = newWeek._id; // _id der neu erstellten Woche
            console.log(weekId);
            await createPlanEntries(weekId);
        }
        
        // Gib die Kalenderwoche als JSON zurück
        return NextResponse.json({ week_number }, { status: 200 });
    } catch (e) {
        // Gib im Fehlerfall eine Fehlermeldung zurück
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

function getWeekNumber(date) {
    var target = new Date(date.valueOf());
    var dayNumber = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

async function createPlanEntries(weekId) {
    // Logik zum Erstellen von Einträgen in der Plan-Tabelle
    const daysWithMealIds = [
        { "day-number": 1, "meal-ids": [0, 0, 0, 0] },
        { "day-number": 2, "meal-ids": [0, 0, 0, 0] },
        { "day-number": 3, "meal-ids": [0, 0, 0, 0] },
        { "day-number": 4, "meal-ids": [0, 0, 0, 0] },
        { "day-number": 5, "meal-ids": [0, 0, 0, 0] },
        { "day-number": 6, "meal-ids": [0, 0] }
    ];
    try {
            for (const day of daysWithMealIds) {
                await Plan.create({
                    "week-id": weekId,
                    ...day
                });
            }
        } catch (error) {
            console.error("Fehler beim Speichern der Woche:", error);
            throw new Error("Fehler beim Speichern der Woche");
        }
   
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
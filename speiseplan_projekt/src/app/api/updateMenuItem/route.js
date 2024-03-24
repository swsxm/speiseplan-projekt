import { NextResponse } from "next/server";
import Plan from "@/models/plans"
import Week from "@/models/weeks"
import { connectMongoDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/verifyToken";

export async function POST(req) {
    try {
        // Token aus der Anfrage extrahieren
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }
        // Token verifizieren und prüfen ob Admin
        const payload = await verifyAuth(token);
        if(payload.admin == false){
            return NextResponse.json({ status: 403, message: "Not an admin" });
        }
        // Extrahiere erforderliche Informationen aus der Anfrage
        const {item, selectedDay}  = await req.json();
        const date = new Date(selectedDay)
        const dayNumber = date.getDay();
        // Stelle eine Verbindung zur MongoDB her
        await connectMongoDB();
        const selectedWeek = await Week.findOne({
            "week-number": getWeekNumber(date),
            "year": date.getFullYear()
        });

        const existingPlan = await Plan.findOne({
            "week-id": selectedWeek,
            "day-number": dayNumber
        });

        let index = 0;
        switch(item.type) {
            case "Menu1":
                index = 0;
                break;
            case "Menu2":
                index = 1;
                break;
            case "Nachtisch":
                index = 2;
                break;
            case "Suppe":
                index = 3;
                break;
        }
        existingPlan["meal-ids"][index] = item.id;
        await existingPlan.save();

        // Erfolgsmeldung zurückgeben
        return NextResponse.json({ status: 201, message: "Meal created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
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
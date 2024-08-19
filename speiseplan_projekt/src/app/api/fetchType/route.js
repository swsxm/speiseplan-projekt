import Meals from "@/models/meals";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectMongoDB();

        // Hole den Typ aus dem JSON-Body
        const { type } = await req.json();

        // Finde Mahlzeiten des angegebenen Typs
        const mealsFromDb = await Meals.find({ "type": type }).exec();
        
        // Konvertiere die Daten in das MenuItem-Format
        const menuItems = mealsFromDb.map(meal => ({
            _id: meal._id.toString(),  // MongoDB ObjectId in String umwandeln
            name: meal.Name,           // Annahme: Die Datenbank hat `Name` als Feld
            description: meal.Beschreibung, // Annahme: Die Datenbank hat `Beschreibung` als Feld
            price: meal.price,         // Annahme: Die Datenbank hat `price` als Feld
            imageUrl: meal.link_fur_image, // Annahme: Die Datenbank hat `link_fur_image` als Feld
            type: meal.type            // Annahme: Die Datenbank hat `type` als Feld
        }));

        // Gebe die konvertierten Daten zurück
        return NextResponse.json(menuItems, { status: 200 });
    } catch (e) {
        // Gebe eine Fehlermeldung zurück
        return NextResponse.json(
            { message: e.message },  // Verwende e.message für eine detaillierte Fehlermeldung
            { status: 500 }
        );
    }
}

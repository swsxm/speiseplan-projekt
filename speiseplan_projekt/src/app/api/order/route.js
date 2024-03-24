import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import { verifyAuth } from "@/lib/verifyToken";

export async function POST(req) {
    try {
        // Token aus der Anfrage extrahieren
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }
        
        // Token verifizieren und Benutzerinformationen extrahieren
        const payload = await verifyAuth(token);
        // Extrahiere erforderliche Informationen aus der Anfrage
        const  { ordered_meals_id } = await req.json();
        const date = new Date();
        // Stelle eine Verbindung zur MongoDB her
        await connectMongoDB();
        // Erstelle die Bestellung in der Datenbank
        await Order.create({
            "user-id": payload.id,
            "date": date,
            "orderedMeals": ordered_meals_id.map(item => ({
                id: item.type,
                date: item.date, 
                quantity: item.quantity,
                day: item.day
            }))
        });
        console.log('jaaa')
        // Erfolgsmeldung zurückgeben
        return NextResponse.json({ status: 201, message: "Order created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        console.log('jaa')
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
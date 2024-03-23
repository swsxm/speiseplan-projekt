import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/verifyToken";

export async function GET(req) {
    try {
        // Token aus der Anfrage extrahieren
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }
        
        // Token verifizieren und Benutzerinformationen extrahieren
        const payload = await verifyAuth(token);
        
        // Erfolgsmeldung zurückgeben
        return NextResponse.json(payload); // Return payload directly
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
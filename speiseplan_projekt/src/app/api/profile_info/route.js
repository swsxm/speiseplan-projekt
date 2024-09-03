import { NextResponse } from "next/server";
import { verifyUser }from "../../../lib/verifyToken"

export async function GET(req) {
    try {
        const check = await verifyUser(req)
        if (check instanceof NextResponse) {
            return check
        }
        const payload = check;
        
        // Erfolgsmeldung zurückgeben
        return NextResponse.json(payload); // Return payload directly
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
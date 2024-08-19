import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import Meal from "@/models/meals";
import { verifyAuth } from "@/lib/verifyToken";
import { NextResponse } from "next/server";
import { getWeek, startOfWeek, endOfWeek } from 'date-fns';


export async function GET(req, res) {
    try {
        // Benutzer-Authentifizierung überprüfen
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" });
        }

        const payload = await verifyAuth(token);
        if (!payload.admin) {
            return NextResponse.json({ status: 403, message: "Forbidden" });
        }

        await connectMongoDB();

        // Berechnung des Datumsbereichs für die aktuelle Woche
        const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

        // Aggregation zum Abrufen und Auflösen der Mahlzeiten
            // Filtern nach Bestellungen in der aktuellen Woche
            const ordersWithMealAggregation = await Order.aggregate([
                // Filtern nach Bestellungen in der aktuellen Woche
                {
                    $match: {
                        date: {
                            $gte: startOfCurrentWeek,
                            $lte: endOfCurrentWeek
                        }
                    }
                },
                // Auflösen des Arrays 'orderedMeals'
                {
                    $unwind: "$orderedMeals"
                },
                // Projektion der relevanten Felder
                {
                    $project: {
                        _id: 1, // Behalte die ursprüngliche Order _id
                        "user-id": 1, // Behalte die user-id
                        date: 1, // Behalte das Datum der Bestellung
                        quantity: "$orderedMeals.quantity", // Extrahiere die Menge
                        mealDate: "$orderedMeals.date", // Extrahiere das Datum der Mahlzeit
                        mealDay: "$orderedMeals.day", // Extrahiere den Tag der Mahlzeit
                        mealId: "$orderedMeals.mealId" // Extrahiere die mealId
                    }
                },
                // Join (Populatieren) der Mahlzeitdetails
                {
                    $lookup: {
                        from: "meals", // Die Kollektion mit Mahlzeitdetails
                        foreignField: "_id", // Feld in der 'meals'-Kollektion, auf das verwiesen wird
                        localField: "mealId", // Das Feld in den extrahierten Daten, das referenziert
                        as: "mealDetails" // Neuer Name für das Feld, das die Mahlzeitdetails enthält
                    }
                },
                // Entpacken des Arrays 'mealDetails', da $lookup ein Array zurückgibt
                {
                    $unwind: "$mealDetails"
                },
                // Gruppieren nach Mahlzeit und Aggregieren der Menge und des Gesamtpreises
                {
                    $group: {
                        _id: "$mealId", // Gruppieren nach Mahlzeit-ID
                        totalQuantity: { $sum: "$quantity" }, // Gesamte Menge für jede Mahlzeit
                        totalPrice: { $sum: { $multiply: ["$quantity", "$mealDetails.price"] } }, // Gesamtpreis für jede Mahlzeit
                        mealName: { $first: "$mealDetails.Name" }, // Den Namen der Mahlzeit übernehmen
                        mealDescription: { $first: "$mealDetails.Beschreibung" }, // Die Beschreibung der Mahlzeit übernehmen
                        mealType: { $first: "$mealDetails.type" }, // Den Typ der Mahlzeit übernehmen
                        mealImage: { $first: "$mealDetails.link_fur_image" } // Das Bild der Mahlzeit übernehmen
                    }
                },
                // Umbenennen des '_id'-Felds in 'mealId'
                {
                    $project: {
                        _id: 0, // Verwirf das ursprüngliche _id-Feld
                        mealId: "$_id", // Benenne das _id-Feld in mealId um
                        totalQuantity: 1, // Behalte die Gesamtsumme
                        totalPrice: 1, // Behalte den Gesamtpreis
                        mealName: 1, // Behalte den Namen der Mahlzeit
                        mealDescription: 1, // Behalte die Beschreibung der Mahlzeit
                        mealType: 1, // Behalte den Typ der Mahlzeit
                        mealImage: 1 // Behalte den Link zum Bild der Mahlzeit
                    }
                }
            ]);
            
            console.log(ordersWithMealAggregation);
            
        return NextResponse.json({ status: 200, orders: ordersWithMealAggregation });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}

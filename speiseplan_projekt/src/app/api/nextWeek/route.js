import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import Weeks from "@/models/weeks";
import Plan from "@/models/plans";
import Meals from "@/models/meals"; 
import { verifyAuth } from "@/lib/verifyToken";
import { NextResponse } from "next/server";

async function getWeekNumber(datum) {
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

function getNextWeekNumber() {
    const today = new Date();
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    const nextWeekNumber =  getWeekNumber(nextWeek); 
    return nextWeekNumber;
}

export async function GET(req, res) {
    try {
        // Verify user authentication
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ status: 401, message: "Unauthorized" }); 
        }
        
        const payload = await verifyAuth(token);
        if (!payload.admin) {
            return NextResponse.json({ status: 403, message: "Forbidden" });
        }

        await connectMongoDB();

        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        const endOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const nextWeek = await getNextWeekNumber(); 
        console.log(startOfWeek)
        console.log(endOfWeek)
        const weekDocument = await Weeks.findOne({ "week-number": nextWeek });
        const planDocument = await Plan.find({ "week-id": weekDocument._id });
        const processedOrders = [];
        console.log(startOfWeek)
        console.log(endOfWeek)

        // Maintain a set of processed meal IDs
        const processedMealIds = new Set();

        for (const day of planDocument) {
            for (const id of day['meal-ids']) {
                // Check if the meal ID has already been processed
                if (processedMealIds.has(id)) {
                    continue; // Skip processing if already processed
                }

                let quantity = 0;
                let price = 0;
                let url = null;
                let name = '';
                let beschreibung = '';
                let type = '';
                let found = false;
                
                // Fetch all orders for the current meal ID within the week
                const ordersForMeal = await Order.find({
                    "orderedMeals.id": id,
                    date: {
                        $gte: startOfWeek,
                        $lte: endOfWeek
                    }
                });

                // Accumulate quantities across orders
                for (const order of ordersForMeal) {
                    for (const orderedMeal of order.orderedMeals) {
                        if (orderedMeal.id === id) {
                            quantity += orderedMeal.quantity;
                            found = true;
                        }
                    }
                }

                // Fetch meal details
                const meal = await Meals.findOne({ 'id': id }); 
                if (meal && found) {
                    price = (quantity * meal.price);
                    url = meal.link_fur_image; 
                    name = meal.Name;
                    beschreibung = meal.Beschreibung; 
                    type = meal.type;
                    processedOrders.push({
                        id: id,
                        anzahl: quantity,
                        price,
                        url,
                        name,
                        Beschreibung: beschreibung,
                        type
                    });
                    processedMealIds.add(id); // Add the processed meal ID to the set
                }
            }
        }
        return NextResponse.json({ status: 200, orders: processedOrders });
    } catch (error) {
        console.error("Error retrieving orders:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}

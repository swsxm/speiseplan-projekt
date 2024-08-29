import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import { verifyUser } from "../../../lib/verifyToken";

export async function POST(req) {
    /**
     * Order logic here
     */
  try {
    const check = await verifyUser(req);
    if (check instanceof NextResponse) {
      return check;
    }
    const payload = check;

    const { ordered_meals_id } = await req.json();

    await connectMongoDB();

    await Order.create({
      "user-id": payload.id,
      "date": new Date(),  
      "orderedMeals": ordered_meals_id.map(item => {
        const orderDate = new Date(item.date);
        orderDate.setUTCHours(0, 0, 0, 0); 
        return {
          mealId: item._id,
          quantity: item.quantity,
          day: item.day,
          date: orderDate
        };
      })
    });
    return NextResponse.json({ status: 201, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}

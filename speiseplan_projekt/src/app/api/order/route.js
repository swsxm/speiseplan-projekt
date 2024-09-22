import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import Plan from "@/models/plans";
import { verifyUser } from "../../../lib/verifyToken";
import { calenderWeek, dayNameToNumber } from "../../../lib/datetimeHelpers";

export async function POST(req) {
  try {
    const check = await verifyUser(req);
    if (check instanceof NextResponse) {
      return check;
    }
    const payload = check;
    const { ordered_meals_id } = await req.json();

    const nextWeek = calenderWeek(new Date(Date.now())) + 1;
    await connectMongoDB();

    // Fetch all the plans for the next week
    const plans = await Plan.find({ "weekId": nextWeek });

    if (!plans || plans.length === 0) {
      return NextResponse.json({ error: `No plans found for week ${nextWeek}` }, { status: 404 });
    }

    // Group plans by dayNumber for easier access
    const plansByDay = {};
    plans.forEach(plan => {
      plansByDay[plan['dayNumber']] = plan["mealIds"].map(mealId => mealId.toString());
    });

    /**
     * Validate the ordered meals:
     * - Check if each meal corresponds to a valid plan for the correct day
     * - Validate the meal exists in the day's plan
     */
    let isValidOrder = true;
    ordered_meals_id.forEach(orderedMeal => {
      const { day, mealId } = orderedMeal;
      // Convert day name to day number 
      const dayNumber = dayNameToNumber[day];
      if (dayNumber === undefined) {
        isValidOrder = false;
        return;
      }
      // Validate mealId
      if (!mealId) {
        isValidOrder = false;
        return;
      }
      // Ensure the day exists in the plan and contains the ordered mealId
      if (!plansByDay[dayNumber] || !plansByDay[dayNumber].includes(mealId.toString())) {
        isValidOrder = false;
      }
    });

    if (!isValidOrder) {
      return NextResponse.json({ error: `One or more meals are not valid for the selected day.` }, { status: 400 });
    }

    // If validation passes, proceed to create the order
    await Order.create({
      "userId": payload.id,
      "date": new Date(),
      "orderedMeals": ordered_meals_id.map(item => {
        const orderDate = new Date(item.date);
        orderDate.setUTCHours(0, 0, 0, 0); 
        return {
          mealId: item.mealId,
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

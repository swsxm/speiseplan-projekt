/**
 * @jest-environment node
 */
import { POST as getOrderPOST } from "@/app/api/getOrders/route";
import Order from "@/models/orders";
import { verifyUser } from "../../../lib/verifyToken";
import { connectMongoDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";

// Mock dependencies
jest.mock("../../../lib/verifyToken", () => ({
  verifyUser: jest.fn(),
}));
jest.mock("@/models/orders", () => ({
  aggregate: jest.fn(),
}));
jest.mock("@/lib/mongodb", () => ({
  connectMongoDB: jest.fn(),
}));

describe("POST /api/getOrders", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 400 for invalid date", async () => {
    // Mock verifyUser
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" });

    const req = {
      json: jest.fn().mockResolvedValue({
        date: "invalid-date",
        userId: "userId123",
      }),
    } as unknown as NextRequest;

    const response = await getOrderPOST(req);

    expect(response.status).toBe(400);
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe("Invalid date provided.");
  });

  it("should return 200 and a message when no orders are found", async () => {
    // Mock verifyUser and Order aggregate
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" });
    (Order.aggregate as jest.Mock).mockResolvedValue([]);

    const req = {
      json: jest.fn().mockResolvedValue({
        date: "2023-09-10",
        userId: "userId123",
      }),
    } as unknown as NextRequest;

    const response = await getOrderPOST(req);

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe("No orders found for this user and date.");
  });

  it("should return 200 with orders when they exist", async () => {
    // Mock verifyUser and Order aggregate
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" });
    (Order.aggregate as jest.Mock).mockResolvedValue([
      {
        orderMealId: "meal123",
        quantity: 2,
        date: "2023-09-10",
        name: "Pizza",
        description: "Delicious pizza",
        price: 10,
        image: "pizza.jpg",
        type: "Menu1",
      },
    ]);

    const req = {
      json: jest.fn().mockResolvedValue({
        date: "2023-09-10",
        userId: "userId123",
      }),
    } as unknown as NextRequest;

    const response = await getOrderPOST(req);

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual([
      {
        orderMealId: "meal123",
        quantity: 2,
        date: "2023-09-10",
        name: "Pizza",
        description: "Delicious pizza",
        price: 10,
        image: "pizza.jpg",
        type: "Menu1",
      },
    ]);
  });
});

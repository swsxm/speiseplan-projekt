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
    /**
     * Test that returns 400 status for invalid date format
     */
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" }); // Mock user verification

    const req = {
      json: jest.fn().mockResolvedValue({
        date: "invalid-date",
        userId: "userId123",
      }),
    } as unknown as NextRequest;

    const response = await getOrderPOST(req);

    expect(response.status).toBe(400); // Assert that the status is 400
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe("Invalid date provided."); // Assert correct error message
  });

  it("should return 200 and a message when no orders are found", async () => {
    /**
     * Test that returns 200 with a message when no orders are found
     */
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" }); // Mock user verification
    (Order.aggregate as jest.Mock).mockResolvedValue([]); // Mock empty order list

    const req = {
      json: jest.fn().mockResolvedValue({
        date: "2023-09-10",
        userId: "userId123",
      }),
    } as unknown as NextRequest;

    const response = await getOrderPOST(req);

    expect(response.status).toBe(200); // Assert that the status is 200
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe("No orders found for this user and date."); // Assert correct message
  });

  it("should return 200 with orders when they exist", async () => {
    /**
     * Test that returns 200 with orders when they exist
     */
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" }); // Mock user verification
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
    ]); // Mock existing order data

    const req = {
      json: jest.fn().mockResolvedValue({
        date: "2023-09-10",
        userId: "userId123",
      }),
    } as unknown as NextRequest;

    const response = await getOrderPOST(req);

    expect(response.status).toBe(200); // Assert that the status is 200
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
    ]); // Assert that the correct order data is returned
  });
});

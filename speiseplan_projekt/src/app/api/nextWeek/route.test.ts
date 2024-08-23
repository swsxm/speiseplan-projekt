/**
 * @jest-environment node
 */
import { GET } from "@/app/api/nextWeek/route";
import Order from "@/models/orders";
import { verifyAdmin } from "../../../lib/verifyToken";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

// Mock the dependencies
jest.mock("../../../lib/verifyToken", () => ({
  verifyAdmin: jest.fn(),
}));

jest.mock("@/models/orders", () => ({
  aggregate: jest.fn(),
}));

jest.mock("@/lib/mongodb", () => ({
  connectMongoDB: jest.fn(),
}));

describe("GET /api/orders", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return data with status 200", async () => {
    const mockPayload = { admin: true };
    const mockOrders = [
      {
        mealId: "123",
        totalQuantity: 10,
        totalPrice: 100,
        mealName: "Pizza",
        mealDescription: "Delicious pizza",
        mealType: "Menu1",
        mealImage: "pizza.jpg",
      },
    ];

    // Mock implementations
    (verifyAdmin as jest.Mock).mockResolvedValue(mockPayload);
    (Order.aggregate as jest.Mock).mockResolvedValue(mockOrders);
    (connectMongoDB as jest.Mock).mockResolvedValue(undefined); // Mocking connection

    // Create a mock NextRequest and NextResponse
    const req = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "mockToken" }),
      },
    } as unknown as NextRequest;

    const mockJsonResponse = jest
      .fn()
      .mockResolvedValue({ orders: mockOrders });
    const res = {
      json: mockJsonResponse,
      status: jest.fn().mockReturnThis(),
    } as unknown as NextResponse;

    // Await the GET response
    const response = await GET(req, res);

    // Extract the JSON from the response
    const jsonResponse = await response.json();

    // Perform assertions on the response data
    expect(response.status).toBe(200);
    expect(jsonResponse.orders).toEqual(mockOrders);
  });
});

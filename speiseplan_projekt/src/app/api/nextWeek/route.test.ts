/**
 * @jest-environment node
 */
import { GET } from "@/app/api/nextWeek/route";
import Order from "@/models/orders";
import { verifyAdmin } from "../../../lib/verifyToken";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { startOfWeek, endOfWeek } from "date-fns";

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

describe("GET /api/nextWeek", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return aggregated data with status 200", async () => {
    const mockPayload = { admin: true };
    const mockOrdersWithMealAggregation = [
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
    (Order.aggregate as jest.Mock).mockResolvedValue(
      mockOrdersWithMealAggregation
    );
    (connectMongoDB as jest.Mock).mockResolvedValue(undefined); // Mocking connection

    // Create a mock NextRequest and NextResponse
    const req = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "mockToken" }),
      },
    } as unknown as NextRequest;

    const mockJsonResponse = jest
      .fn()
      .mockResolvedValue({ orders: mockOrdersWithMealAggregation });
    const res = {
      json: mockJsonResponse,
      status: jest.fn().mockReturnThis(),
    } as unknown as NextResponse;

    const response = await GET(req, res);

    const jsonResponse = await response.json();

    // Perform assertions on the response data
    expect(response.status).toBe(200);
    expect(jsonResponse.orders).toEqual(mockOrdersWithMealAggregation);
  });

  it("should return status 500 if there is an error", async () => {
    // Simulate an error during verification
    (verifyAdmin as jest.Mock).mockImplementation(() => {
      throw new Error("Verification error");
    });

    // Create a mock NextRequest and NextResponse
    const req = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "mockToken" }),
      },
    } as unknown as NextRequest;

    // Create a mock NextResponse
    const mockJsonResponse = jest.fn();
    const res = {
      json: mockJsonResponse,
      status: jest.fn().mockReturnThis(),
    } as unknown as NextResponse;

    const response = await GET(req, res);

    const jsonResponse = await response.json();

    // Perform assertions on the response data
    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Internal Server Error");
  });
});

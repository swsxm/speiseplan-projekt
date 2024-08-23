/**
 * @jest-environment node
 */
import { GET } from './route';
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/orders";
import { verifyAuth } from "@/lib/verifyToken";
import { NextResponse } from "next/server";

// Mocking the dependencies
jest.mock('@/lib/mongodb', () => ({
  connectMongoDB: jest.fn(),
}));

jest.mock('@/models/orders', () => ({
  aggregate: jest.fn(),
}));

jest.mock('@/lib/verifyToken', () => ({
  verifyAuth: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('GET /api/orders', () => {
  it('should return data with status 200', async () => {
    const mockToken = 'mock-token';
    const mockPayload = { admin: true };
    const mockOrders = [
      {
        mealId: 'meal1',
        totalQuantity: 5,
        totalPrice: 50,
        mealName: 'Meal 1',
        mealDescription: 'Delicious meal 1',
        mealType: 'Menu1',
        mealImage: 'meal1.jpg',
      },
    ];

    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: mockToken }),
      },
    };

    (verifyAuth as jest.Mock).mockResolvedValue(mockPayload); // Mocking successful auth verification
    (Order.aggregate as jest.Mock).mockResolvedValue(mockOrders); // Mocking successful data retrieval from database
    (NextResponse.json as jest.Mock).mockReturnValue({
      status: 200,
      json: jest.fn().mockResolvedValue({
        orders: mockOrders,
      }),
    });

    const response = await GET(mockReq as any, {} as any);
    const body = await response.json();

    // Asserting the response status and body
    expect(response.status).toBe(200);
    expect(body.orders).toEqual(mockOrders);
    expect(connectMongoDB).toHaveBeenCalled(); // Checking if MongoDB connection was made
    expect(verifyAuth).toHaveBeenCalledWith(mockToken); // Checking if auth verification was called with the correct token
    expect(Order.aggregate).toHaveBeenCalled(); // Checking if the aggregate method was called
    expect(NextResponse.json).toHaveBeenCalledWith({ status: 200, orders: mockOrders }); // Checking if the JSON response was called with correct data
  });
});

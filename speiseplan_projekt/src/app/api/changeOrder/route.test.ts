/**
 * @jest-environment node
 */
import { POST as changeOrderPOST } from "@/app/api/changeOrder/route";
import Order from "@/models/orders";
import { verifyUser } from "@/lib/verifyToken";
import { connectMongoDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { validateDate } from "../../../lib/validationHelpers";

// Mock dependencies
jest.mock("../../../lib/verifyToken", () => ({
  verifyUser: jest.fn(),
}));

jest.mock("@/models/orders", () => ({
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock("@/lib/mongodb", () => ({
  connectMongoDB: jest.fn(),
}));

jest.mock("../../../lib/validationHelpers", () => ({
  validateDate: jest.fn(),
}));

describe("POST /api/changeOrder", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 400 for an invalid date", async () => {
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" });
    const req = {
      json: jest.fn().mockResolvedValue({
        updatedMeals: [],
        userId: "userId123",
        date: "invalid-date",
      }),
    } as unknown as NextRequest;

    const response = await changeOrderPOST(req);

    expect(response.status).toBe(400);
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe("Invalid date provided.");
  });


  it("should update order meals successfully", async () => {
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" });
    (validateDate as jest.Mock).mockReturnValue(true);
    const mockOrder = {
      orderedMeals: {
        id: jest.fn().mockReturnValue({ _id: "meal123", quantity: 2 }),
        pull: jest.fn(),
      },
      save: jest.fn(),
    };
    (Order.find as jest.Mock).mockResolvedValue([mockOrder]);

    const req = {
      json: jest.fn().mockResolvedValue({
        updatedMeals: [{ orderMealId: "meal123", quantity: 1 }],
        userId: "userId123",
        date: "2025-09-10",
      }),
    } as unknown as NextRequest;

    const response = await changeOrderPOST(req);

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse.message).toBe("Orders updated successfully.");
  });

  it("should delete an order if all meals are removed", async () => {
    (verifyUser as jest.Mock).mockResolvedValue({ id: "userId123" });
    (validateDate as jest.Mock).mockReturnValue(true);
  
    const mockOrder = {
      _id: "order123",
      orderedMeals: {
        id: jest.fn().mockReturnValue({ _id: "meal123", quantity: 1 }), // Mock meal to be removed
        pull: jest.fn(), // Mock pull method to simulate removing the meal
        length: 0, // Set the length to 0 to trigger the order deletion
      },
      save: jest.fn(), // Mock save method
    };
    
    (Order.find as jest.Mock).mockResolvedValue([mockOrder]); // Return the mock order
  
    const req = {
      json: jest.fn().mockResolvedValue({
        updatedMeals: [{ orderMealId: "meal123", quantity: 0 }], // Meal quantity 0 to simulate removal
        userId: "userId123",
        date: "2023-09-10",
      }),
    } as unknown as NextRequest;
  
    const response = await changeOrderPOST(req);
  
    expect(mockOrder.orderedMeals.pull).toHaveBeenCalledWith({ _id: "meal123" });
    expect(Order.findByIdAndDelete).toHaveBeenCalledWith("order123");
    expect(response.status).toBe(200);
  });
  
});

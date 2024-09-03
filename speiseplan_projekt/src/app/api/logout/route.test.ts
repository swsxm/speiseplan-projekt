/**
 * @jest-environment node
 */
import { POST } from "@/app/api/logout/route"; 
import { NextResponse } from "next/server";

// Mocking NextResponse to control its behavior in the tests
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe("POST /api/logout", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return status 200 and clear cookies if logout is successful", async () => {
    // Arrange: Setting up mock response and cookie behavior
    const mockJsonResponse = {
      json: jest.fn().mockReturnThis(),
      cookies: {
        set: jest.fn(),
      },
    };
    (NextResponse.json as jest.Mock).mockReturnValue(mockJsonResponse);

    // Act: Trigger the POST logout function
    const response = await POST();

    // Assert: Check if the response includes the correct message and cookies are cleared
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Logout successful",
        success: true,
      }
    );
    expect(mockJsonResponse.cookies.set).toHaveBeenCalledWith("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    expect(mockJsonResponse.cookies.set).toHaveBeenCalledWith("name", "", {
      expires: new Date(0),
    });
  });

  it("should return status 500 if there is an error", async () => {
    // Simulate an error during cookie setting to test error handling
    const mockJsonResponse = {
      json: jest.fn().mockReturnThis(),
      cookies: {
        set: jest.fn().mockImplementation(() => {
          throw new Error("Internal error");
        }),
      },
    };
    (NextResponse.json as jest.Mock).mockReturnValue(mockJsonResponse);

    // Act: Trigger the POST logout function
    const response = await POST();

    // Assert: Check if the error response is generated with the correct status and message
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal error" },
      { status: 500 }
    );
  });
});

/**
 * @jest-environment node
 */
import { POST } from "@/app/api/logout/route"; 
import { NextResponse } from "next/server";

// Mocking NextResponse
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
    // Arrange
    const mockJsonResponse = {
      json: jest.fn().mockReturnThis(),
      cookies: {
        set: jest.fn(),
      },
    };
    (NextResponse.json as jest.Mock).mockReturnValue(mockJsonResponse);

    // Act
    const response = await POST();

    // Assert
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
    // Simulate an error by throwing an exception when setting cookies
    const mockJsonResponse = {
      json: jest.fn().mockReturnThis(),
      cookies: {
        set: jest.fn().mockImplementation(() => {
          throw new Error("Internal error");
        }),
      },
    };
    (NextResponse.json as jest.Mock).mockReturnValue(mockJsonResponse);

    // Act
    const response = await POST();

    // Assert
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Internal error" },
      { status: 500 }
    );
});
});

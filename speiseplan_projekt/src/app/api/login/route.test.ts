/**
 * @jest-environment node
 */
import { POST } from "@/app/api/login/route";
import Users from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Mock the dependencies
jest.mock("@/models/users", () => ({
  findOne: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("@/lib/mongodb", () => ({
  connectMongoDB: jest.fn(),
}));

describe("POST /api/login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return status 400 if the user is not found", async () => {
    // Mocking Users.findOne to return null, simulating a non-existent user
    (Users.findOne as jest.Mock).mockResolvedValue(null);

    const req = {
      // Mocking the request to simulate input data
      json: jest.fn().mockResolvedValue({ id: "test-id", password: "test-password" }),
    } as unknown as NextRequest;

    const response = await POST(req);

    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
  });

  it("should return status 400 if the password is invalid", async () => {
    // Simulating a found user with a hashed password
    const mockUser = { employeeId: "test-id", password: "hashed-password" };
    (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    // Mocking bcrypt.compare to simulate an incorrect password
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = {
      // Mocking the request to simulate input data
      json: jest.fn().mockResolvedValue({ id: "test-id", password: "test-password" }),
    } as unknown as NextRequest;

    const response = await POST(req);

    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
  });

  it("should return status 201 and set cookies if login is successful", async () => {
    // Simulating a found user with all necessary data
    const mockUser = {
      employeeId: "test-id",
      password: "hashed-password",
      name: "Test User",
      email: "test@example.com",
      admin: true,
    };
    (Users.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    // Mocking bcrypt.compare to simulate a successful password match
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    
    // Mocking jwt.sign to return a dummy token
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    const req = {
      // Mocking the request to simulate input data
      json: jest.fn().mockResolvedValue({ id: "test-id", password: "test-password" }),
    } as unknown as NextRequest;

    const response = await POST(req);

    const jsonResponse = await response.json();

    expect(response.status).toBe(201);
    expect(jsonResponse.message).toBe("Login successful");
    
    expect(response.cookies.get("token")?.value).toEqual("mockToken");
    expect(response.cookies.get("name")?.value).toEqual(mockUser.name);
  });

  it("should return status 500 if there is an error", async () => {
    // Mocking Users.findOne to throw an error, simulating a database failure
    (Users.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const req = {
      // Mocking the request to simulate input data
      json: jest.fn().mockResolvedValue({ id: "test-id", password: "test-password" }),
    } as unknown as NextRequest;

    const response = await POST(req);

    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.error).toBe("Database error");
  });
});

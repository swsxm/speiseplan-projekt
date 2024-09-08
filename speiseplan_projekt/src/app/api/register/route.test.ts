/**
 * @jest-environment node
 */
import { POST } from "@/app/api/register/route";
import Users from "@/models/users";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import { validateLength, validateNumber, validateEmail } from "@/lib/validationHelpers";
import { NextRequest, NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/models/users", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("@/lib/mongodb", () => ({
  connectMongoDB: jest.fn(),
}));

jest.mock("@/lib/validationHelpers", () => ({
  validateLength: jest.fn(),
  validateNumber: jest.fn(),
  validateEmail: jest.fn(),
}));

describe("POST /api/register", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if validation fails", async () => {
    // Mock validation helper to return errors
    (validateEmail as jest.Mock).mockReturnValue("Invalid email format");
    (validateNumber as jest.Mock).mockReturnValue(null); // Valid ID
    bcrypt.hash.mockResolvedValue("hashed-password");

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "A",
        email: "invalid-email",
        id: "123456",
        password: "Password123!",
      }),
    } as unknown as NextRequest;

    const response = await POST(req);

    const jsonResponse = await response.json();
    expect(response.status).toBe(400);
    expect(jsonResponse.error).toContain("Invalid email format");
  });

  it("should return 400 if user already exists", async () => {
    (validateLength as jest.Mock).mockReturnValue(null);
    (validateEmail as jest.Mock).mockReturnValue(null);
    (validateNumber as jest.Mock).mockReturnValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");

    (Users.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "existing-user-id" }) // Mocking select
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
        id: "123456",
        password: "Password123!",
      }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.error).toBe("A user with this ID already exists.");
  });

  it("should return 201 if user is created successfully", async () => {
    // Mock validation to pass
    (validateLength as jest.Mock).mockReturnValue(null);
    (validateEmail as jest.Mock).mockReturnValue(null);
    (validateNumber as jest.Mock).mockReturnValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");

    // Mock successful connection to MongoDB
    (connectMongoDB as jest.Mock).mockResolvedValue({});

    // Mock findOne to return an object with select method
    (Users.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null), // Ensuring select returns null
    });

    // Mock successful user creation
    (Users.create as jest.Mock).mockResolvedValue({});

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
        id: "123456",
        password: "Password123!",
      }),
    } as unknown as NextRequest;

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(201);
    expect(jsonResponse.message).toBe("User created successfully");
    expect(Users.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      employee_id: "123456",
      password: "hashed-password",
      admin: false,
    });
  });


  it("should return 500 if an internal error occurs", async () => {
    // Mock validation to pass
    (validateLength as jest.Mock).mockReturnValue(null);
    (validateEmail as jest.Mock).mockReturnValue(null);
    (validateNumber as jest.Mock).mockReturnValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");

    // Mock an error during user creation
    (Users.create as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
        id: "123456",
        password: "Password123!",
      }),
    } as unknown as NextRequest;

    const response = await POST(req);

    const jsonResponse = await response.json();
    expect(response.status).toBe(500);
    expect(jsonResponse.error).toBe("An internal server error occurred.");
  });

  it("should return 500 if connection to MongoDB fails", async () => {
    // Mock validation to pass
    (validateLength as jest.Mock).mockReturnValue(null);
    (validateEmail as jest.Mock).mockReturnValue(null);
    (validateNumber as jest.Mock).mockReturnValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
  
    // Mock failed connection to MongoDB
    (connectMongoDB as jest.Mock).mockRejectedValue(new Error("Connection error"));
  
    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
        id: "123456",
        password: "Password123!",
      }),
    } as unknown as NextRequest;
  
    const response = await POST(req);
  
    const jsonResponse = await response.json();
    expect(response.status).toBe(500);
    expect(jsonResponse.error).toBe("An internal server error occurred.");
  });
  
  it("should return 500 if bcrypt hashing fails", async () => {
    // Mock validation to pass
    (validateLength as jest.Mock).mockReturnValue(null);
    (validateEmail as jest.Mock).mockReturnValue(null);
    (validateNumber as jest.Mock).mockReturnValue(null);
  
    // Mock bcrypt.hash to throw an error
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("Hashing error"));
  
    // Mock successful connection to MongoDB
    (connectMongoDB as jest.Mock).mockResolvedValue({});
  
    // Mock findOne to return an object with select method
    (Users.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
  
    const req = {
      json: jest.fn().mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
        id: "123456",
        password: "Password123!",
      }),
    } as unknown as NextRequest;
  
    const response = await POST(req);
  
    const jsonResponse = await response.json();
    expect(response.status).toBe(500);
    expect(jsonResponse.error).toBe("An internal server error occurred.");
  });
  
  it("should return 400 if request body is incomplete", async () => {
    // Mock validation to return errors for missing fields
    (validateLength as jest.Mock).mockReturnValue("Name is required");
    (validateEmail as jest.Mock).mockReturnValue("Email is required");
    (validateNumber as jest.Mock).mockReturnValue("ID is required");
    (validateEmail as jest.Mock).mockReturnValue("Password is required");
  
    const req = {
      json: jest.fn().mockResolvedValue({}), // Empty request body
    } as unknown as NextRequest;
  
    const response = await POST(req);
  
    const jsonResponse = await response.json();
    expect(response.status).toBe(400);
  });
  
});

# Next.js Testing Guide

This project utilizes Jest to test Next.js applications with TypeScript. This guide provides a comprehensive overview of how to write and execute tests effectively.

## Test Setup

When creating a new page or route, ensure you also create a corresponding test file in the relevant folder. Name the test file similarly to the file it is testing, with a `.test.` suffix added.

For example:
- For route tests: `route.test.ts`
- For page tests: `page.test.jsx`

Use `.jsx` for React component tests and `.ts` for API tests and other TypeScript-based files.

Refer to existing tests for guidance:
1. `speiseplan_projekt/src/app/api/nextWeek/route.test.ts`
2. `speiseplan_projekt/src/app/test/page.test.jsx`

## Running Tests

To execute all tests, run:
```bash
npm run test
```

To run a specific test file, use:
```bash
npm run test -- ./src/app/test/page.test.jsx
```

To run a specific test file and see a coverage report after use:
```bash
npm run coverage -- ./src/app/test/page.test.jsx
```

## Useful Links

For further reading and to clarify any questions, check out these resources:
1. [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing/jest)
2. [How to Unit Test Next.js 13 App Router API Routes with Jest and React Testing Library](https://dev.to/dforrunner/how-to-unit-test-nextjs-13-app-router-api-routes-with-jest-and-react-testing-library-270a)

Explore these links to enhance your understanding and improve your testing practices.

## Example Tests

Here are examples of two types of tests: one for React components and one for API endpoints with mocking.

### React Component Test

This example demonstrates how to test a React component to ensure it renders correctly.

```jsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from './page.tsx';

describe('Page Component', () => {
  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
```

### API Test

This example shows how to test an API endpoint, including how to mock dependencies.

```ts
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

    // Await the GET response
    const response = await GET(req, res);

    // Extract the JSON from the response
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

    // Await the GET response
    const response = await GET(req, res);

    // Extract the JSON from the response
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

    // Await the GET response
    const response = await GET(req, res);

    // Extract the JSON from the response
    const jsonResponse = await response.json();

    // Perform assertions on the response data
    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Internal Server Error");
  });
});

    // Await the GET response
    const response = await GET(req, res);

    // Extract the JSON from the response
    const jsonResponse = await response.json();

    // Perform assertions on the response data
    expect(response.status).toBe(500);
    expect(jsonResponse.message).toBe("Internal Server Error");
  });
});

```

These examples should help you get started with writing and running tests in your Next.js project.
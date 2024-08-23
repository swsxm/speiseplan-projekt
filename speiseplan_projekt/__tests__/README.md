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

    (verifyAuth as jest.Mock).mockResolvedValue(mockPayload);
    (Order.aggregate as jest.Mock).mockResolvedValue(mockOrders);
    (NextResponse.json as jest.Mock).mockReturnValue({
      status: 200,
      json: jest.fn().mockResolvedValue({
        orders: mockOrders,
      }),
    });

    const response = await GET(mockReq as any, {} as any);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.orders).toEqual(mockOrders);
    expect(connectMongoDB).toHaveBeenCalled();
    expect(verifyAuth).toHaveBeenCalledWith(mockToken);
    expect(Order.aggregate).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ status: 200, orders: mockOrders });
  });
});
```

These examples should help you get started with writing and running tests in your Next.js project.
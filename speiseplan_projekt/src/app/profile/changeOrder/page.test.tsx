import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ChangeOrders from './page'; // Import ChangeOrders component
import React from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

// Mock global `fetch`
global.fetch = jest.fn();

// Mock cookies using `parseCookies`
jest.mock('nookies', () => ({
  parseCookies: jest.fn(() => ({
    employeeID: '12345', // Example `employeeID`
  })),
}));

// Mock Next.js `useRouter`
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Navbar component
jest.mock('@/components/Navbar', () => {
    const MockedNavbar = () => <div>Mocked Navbar</div>;
    MockedNavbar.displayName = 'MockedNavbar';
    return MockedNavbar;
  });
describe('ChangeOrders Page', () => {
  beforeEach(() => {
    // Reset mock for `useRouter`
    (useRouter as jest.Mock).mockReturnValue({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
    });

    // Reset fetch mock before each test
    (fetch as jest.Mock).mockClear();
  });

  it('shows message when no orders are available', async () => {
    // Mocking no orders returned from API
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    // Render the component
    render(<ChangeOrders />);

    // Check if loading state is shown
    expect(screen.getByText(/Lade.../i)).toBeInTheDocument();

    // Wait for the "No orders" message to appear
    await waitFor(() => {
      expect(screen.getByText(/Keine Bestellungen für das ausgewählte Datum gefunden./i)).toBeInTheDocument();
    });
  });

  it('allows increasing and decreasing item quantities', async () => {
    // Example Order Items
    const mockOrderItems = [
      {
        orderMealId: '1',
        _id: '1',
        name: 'Meal 1',
        description: 'A delicious meal',
        price: 10,
        quantity: 2,
        day: 'Monday',
        date: '2024-09-19',
        image: 'meal1.jpg',
        type: 'Main Course',
      },
    ];

    // Mocking `fetch` call
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrderItems,
    });

    // Render the component
    render(<ChangeOrders />);

    // Wait for the data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Meal 1/i)).toBeInTheDocument();
    });

    // Check initial quantity
    expect(screen.getByText('2')).toBeInTheDocument();

    // Increase quantity
    fireEvent.click(screen.getByText('+'));
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    // Decrease quantity
    fireEvent.click(screen.getByText('-'));
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});

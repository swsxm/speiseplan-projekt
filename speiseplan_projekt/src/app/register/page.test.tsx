"use client";

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterForm from "./page";
import { useRouter } from "next/navigation";

// Mocking useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RegisterForm Page", () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the registration form", () => {
    render(<RegisterForm />);

    const heading = screen.getByRole("heading", { name: /Registrieren/i });
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const idInput = screen.getByPlaceholderText(/Mitarbeiter-Nummer/i);
    const passwordInput = screen.getByPlaceholderText(/Passwort/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    expect(heading).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(idInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    render(<RegisterForm />);

    const registerButton = screen.getByRole("button", { name: /Register/i });

    // Simulate form submission without filling the fields
    fireEvent.click(registerButton);

    const errorMessage = await screen.findByText(/All fields are necessary/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("displays error message on failed registration", async () => {
    // Mocking fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "An error occurred" }),
      })
    ) as jest.Mock;

    render(<RegisterForm />);

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const idInput = screen.getByPlaceholderText(/Mitarbeiter-Nummer/i);
    const passwordInput = screen.getByPlaceholderText(/Passwort/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    // Simulate entering data and submitting the form
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(idInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    const errorMessage = await screen.findByText(/An error occurred/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("redirects to homepage on successful registration", async () => {
    // Mocking fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 200 }),
      })
    ) as jest.Mock;

    render(<RegisterForm />);

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const idInput = screen.getByPlaceholderText(/Mitarbeiter-Nummer/i);
    const passwordInput = screen.getByPlaceholderText(/Passwort/i);
    const registerButton = screen.getByRole("button", { name: /Register/i });

    // Simulate entering data and submitting the form
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(idInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    // Wait for any async updates
    await screen.findByRole("button", { name: /Register/i }); // Ensure the component is done processing

    // Ensure mockPush is called with the correct URL
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

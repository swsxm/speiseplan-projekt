import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./page";
import { useRouter } from "next/navigation";

// Mocking useRouter from next/router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login Page", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockPush,
    });
  });

  it("renders the login form", () => {
    render(<Login />);

    const heading = screen.getByRole("heading", { name: /Anmelden/i });
    const idInput = screen.getByPlaceholderText(/Mitarbeiter-Nummer/i);
    const passwordInput = screen.getByPlaceholderText(/Passwort/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    expect(heading).toBeInTheDocument();
    expect(idInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    render(<Login />);

    const loginButton = screen.getByRole("button", { name: /Login/i });

    // Simulate form submission without filling the fields
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByText(/All fields are necessary/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("displays 'Invalid Credentials' on failed login", async () => {
    // Mocking fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid Credentials" }),
      })
    ) as jest.Mock;

    render(<Login />);

    const idInput = screen.getByPlaceholderText(/Mitarbeiter-Nummer/i);
    const passwordInput = screen.getByPlaceholderText(/Passwort/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    // Simulate entering invalid credentials
    fireEvent.change(idInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByText(/Invalid Credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("redirects to homepage on successful login", async () => {
    // Mocking fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 200 }),
      })
    ) as jest.Mock;

    render(<Login />);

    const idInput = screen.getByPlaceholderText(/Mitarbeiter-Nummer/i);
    const passwordInput = screen.getByPlaceholderText(/Passwort/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    // Simulate entering valid credentials
    fireEvent.change(idInput, { target: { value: "12345" } });
    fireEvent.change(passwordInput, { target: { value: "correctpassword" } });
    fireEvent.click(loginButton);

    // Wait for any async updates
    await screen.findByRole("button", { name: /Login/i }); // Ensure the component is done processing

    // Ensure mockPush is called with the correct URL
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

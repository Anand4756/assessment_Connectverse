import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Login from "../../auth/login";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
    jest.clearAllMocks();
  });

  test("validates email format correctly", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Enter email");

    fireEvent.change(emailInput, {
      target: { name: "email", value: "invalid-email" },
    });
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();

    fireEvent.change(emailInput, {
      target: { name: "email", value: "valid@email.com" },
    });
    expect(screen.queryByText("Invalid email format")).not.toBeInTheDocument();
  });

  test("validates password field is not empty", () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText("Enter password");

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "" },
    });
    fireEvent.blur(passwordInput);
    expect(screen.getByText("Password is required")).toBeInTheDocument();

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "password123" },
    });
    expect(screen.queryByText("Password is required")).not.toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(<Login />);
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const toggleButton = passwordInput.parentElement.querySelector("button");

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  test("handles successful login submission", async () => {
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Sign In/i }));

    expect(toast.success).toHaveBeenCalledWith("Login successful!");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("handles remember me checkbox", () => {
    render(<Login />);
    const rememberMeCheckbox = screen.getByRole("checkbox", {
      name: /Remember me/i,
    });

    expect(rememberMeCheckbox).not.toBeChecked();
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
  });

  test("displays forgot password link", () => {
    render(<Login />);
    const forgotPasswordLink = screen.getByText(/Forgot Password\?/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.getAttribute("href")).toBe("/forgot-password");
  });

  test("displays sign up link", () => {
    render(<Login />);
    const signUpLink = screen.getByText(/Sign up/i);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.getAttribute("href")).toBe("/register");
  });
});

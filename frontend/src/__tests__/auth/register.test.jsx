import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Register from "../../auth/register";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("Register Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
    jest.clearAllMocks();
  });

  test("validates email format correctly", () => {
    render(<Register />);
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

  test("validates password requirements", () => {
    render(<Register />);
    const passwordInput = screen.getByPlaceholderText("Enter password");

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "weak" },
    });
    expect(
      screen.getByText(/Password must have at least 6 characters/)
    ).toBeInTheDocument();

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "StrongPass1!" },
    });
    expect(
      screen.queryByText(/Password must have at least 6 characters/)
    ).not.toBeInTheDocument();
  });

  test("validates password confirmation match", () => {
    render(<Register />);
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "StrongPass1!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "confirmPassword", value: "DifferentPass1!" },
    });
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(<Register />);
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const toggleButton = passwordInput.parentElement.querySelector("button");

    expect(passwordInput.type).toBe("password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  test("handles successful form submission", async () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { name: "password", value: "StrongPass1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { name: "confirmPassword", value: "StrongPass1!" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.submit(screen.getByRole("button", { name: /Sign Up/i }));

    expect(toast.success).toHaveBeenCalledWith(
      "Registration successful! Welcome email sent to test@example.com"
    );

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 5000 }
    );
  });

  test("prevents form submission when terms not accepted", () => {
    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { name: "email", value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { name: "password", value: "StrongPass1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { name: "confirmPassword", value: "StrongPass1!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Sign Up/i }));

    expect(toast.success).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

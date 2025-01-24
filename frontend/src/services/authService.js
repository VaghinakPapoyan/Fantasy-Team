// services/authService.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Adjust baseURL to match your setup
  withCredentials: true, // Include cookies in requests
});

// Registration request
export const registerUser = async (userData) => {
  const response = await API.post("/users/registration", {
    ...userData,
    agreeToTerms: true,
  });
  return response.data;
};

export const logoutUser = async () => {
  // Adjust the route as needed.
  const response = await API.post("/users/logout");
  return response.data;
};

// Verification request (if needed)
export const verifyUser = async (verificationData) => {
  const response = await API.post("/users/verify", verificationData);
  return response.data;
};

export async function verifyEmail({ email, verificationCode }) {
  const { data } = await API.post(`/users/verify`, {
    email,
    verificationCode,
  });
  return data;
}

export async function resendVerification({ email }) {
  const response = await API.post("/users/resend-code", {
    email: email,
  });
  return response.data;
}

export const loginUser = async (loginData) => {
  // loginData = { email, password }
  const response = await API.post("/users/login", loginData);
  return response.data;
};

export async function getAccount() {
  // The endpoint you mentioned: "/users/account"
  const { data } = await API.get("/users/account");
  return data;
}

// Request a password reset link:
export const requestPasswordReset = async (email) => {
  const response = await API.post("/users/request-password-reset", { email });
  return response.data; // e.g. { message: 'Password reset link has been sent.' }
};

// Reset the password using the token and new password:
export const resetPassword = async (token, password) => {
  const response = await API.post("/users/reset-password", { token, password });
  return response.data; // e.g. { message: 'Password has been reset successfully.' }
};

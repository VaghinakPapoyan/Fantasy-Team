// Import External Dependencies
import express from "express";
import rateLimiter from "../middlewares/rate-limiter.js";
import dotenv from "dotenv";

// Import Internal Dependencies
import { validateRegistrationData as validation } from "../middlewares/validation.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

// Controllers
import {
  registration, // Handles user registration
  login, // Handles user login
  logout, // Handles user login
  verifyCode, // Handles email verification for new users
  getAccountInfo, // Fetches the authenticated user's account info
  deleteAccount, // Handles account deletion for the authenticated user
  resendVerifyCode, // Handles email verification code resend
} from "../controllers/authentication.js";
import {
  requestPasswordReset, // Handles password reset requests
  resetPassword, // Handles the actual password reset using a token
} from "../controllers/account-recovery.js";
import {
  changeLanguagePreferences, // Changes user's language preferences
  changeNotificationPreferences, // Changes user's notification preferences
  joinLeague, // Add league to user
  leaveLeague, // Remove league from user
} from "../controllers/account-setting.js";
import {
  adminLogin, // Handles admin login
  getAllUsers, // Fetches all users (admin only)
  deleteUser, // Deletes a specific user (admin only)
  getUserById, // Fetches information about a specific user (admin only)
  updateUserById, // Updates a specific user's information (admin only)
  sendUserMail, // Sends an email to a specific user (admin only)
  createUser,
} from "../controllers/admin-user.js";

// Load environment variables from .env file
dotenv.config();

// Create a new router instance
const userRouter = express.Router();

// User Routes
userRouter.post(
  "/registration",
  rateLimiter(15, 5 * process.env.RateLimitMultiply), // Rate limiting: 15 requests per time window
  validation, // Middleware to validate registration data
  registration // Controller to handle user registration
);
userRouter.post(
  "/login",
  rateLimiter(15, 5 * process.env.RateLimitMultiply), // Rate limiting: 15 requests per time window
  login // Controller to handle user login
);
userRouter.post(
  "/logout",
  rateLimiter(15, 5 * process.env.RateLimitMultiply), // Rate limiting: 15 requests per time window
  logout // Controller to handle user logout
);
userRouter.post(
  "/resend-code",
  rateLimiter(60, 3 * process.env.RateLimitMultiply), // Rate limiting: 15 requests per time window
  resendVerifyCode // Controller to handle verification code submission
);
userRouter.post(
  "/verify",
  rateLimiter(15, 5 * process.env.RateLimitMultiply), // Rate limiting: 15 requests per time window
  verifyCode // Controller to handle verification code submission
);
userRouter.post(
  "/request-password-reset",
  rateLimiter(60 * 24, 2 * process.env.RateLimitMultiply), // Rate limiting: 1 request per day
  requestPasswordReset // Controller to handle password reset request
);
userRouter.post(
  "/reset-password",
  rateLimiter(60, 10 * process.env.RateLimitMultiply), // Rate limiting: 1 request per hour
  resetPassword // Controller to handle the password reset
);
userRouter.get(
  "/account",
  authenticate, // Middleware to authenticate the user
  getAccountInfo // Controller to get user's account information
);
userRouter.delete(
  "/",
  rateLimiter(60, 1 * process.env.RateLimitMultiply), // Rate limiting: 1 request per hour
  authenticate, // Middleware to authenticate the user
  deleteAccount // Controller to delete user's account
);
userRouter.post(
  "/change-language",
  authenticate, // Middleware to authenticate the user
  changeLanguagePreferences // Controller to handle change of language preferences
);
userRouter.post(
  "/change-notification-preferences",
  authenticate, // Middleware to authenticate the user
  changeNotificationPreferences // Controller to handle change of notification preferences
);
userRouter.post(
  "/join-league",
  authenticate, // Middleware to authenticate the user
  joinLeague // Controller to handle change of notification preferences
);
userRouter.post(
  "/leave-league",
  authenticate, // Middleware to authenticate the user
  leaveLeague // Controller to handle change of notification preferences
);

// User Admin Routes
userRouter.post(
  "/admin/login",
  rateLimiter(60, 1 * process.env.RateLimitMultiply), // Rate limiting: 1 request per hour
  adminLogin // Controller to handle admin login
);
userRouter.get(
  "/admin/all",
  authenticate, // Middleware to authenticate the user
  authorize(["super-admin"]), // Middleware to authorize access for 'super-admin' users
  getAllUsers // Controller to get all users in the system
);
userRouter.delete(
  "/admin/delete/:userId",
  authenticate, // Middleware to authenticate the user
  authorize(["super-admin"]), // Middleware to authorize access for 'super-admin' users
  deleteUser // Controller to delete a specific user
);
userRouter.get(
  "/admin/:userId",
  authenticate, // Middleware to authenticate the user
  authorize(["super-admin"]), // Middleware to authorize access for 'super-admin' users
  getUserById // Controller to get details about a specific user
);
userRouter.put(
  "/admin/:userId",
  authenticate, // Middleware to authenticate the user
  authorize(["super-admin"]), // Middleware to authorize access for 'super-admin' users
  updateUserById // Controller to update a specific user's information
);
userRouter.post(
  "/admin/create-user",
  authenticate, // Middleware to authenticate the user
  authorize(["super-admin"]), // Middleware to authorize access for 'super-admin' users
  createUser // Controller to update a specific user's information
);
userRouter.post(
  "/admin/send-email/:userId",
  authenticate, // Middleware to authenticate the user
  authorize(["super-admin"]), // Middleware to authorize access for 'super-admin' users
  sendUserMail // Controller to send an email to a specific user
);

// Export the router for use in other files
export default userRouter;

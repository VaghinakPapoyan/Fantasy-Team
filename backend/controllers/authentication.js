import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateReferralCode } from "../utils/referral.js";
import emailVerification from "../utils/emailVerification.js";
import accountLockout from "../utils/accountLockout.js";

dotenv.config();

// User registration route
export async function registration(req, res) {
  try {
    const { email, dateOfBirth, password, promoCode, agreeToTerms } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists and is verified
      if (existingUser.isVerified) {
        return res.status(409).json({ message: "Email already registered." });
      } else {
        // If user exists but not verified, resend verification code
        const { verificationCode, codeExpires } = await emailVerification(
          existingUser.email
        );
        existingUser.verificationCode = verificationCode;
        existingUser.codeExpires = codeExpires;
        await existingUser.save();
        return res.status(400).json({
          message:
            "Email verification pending. Please check your email for the verification code.",
        });
      }
    }

    // Generate a unique referral code for the user
    let referralCode;
    do {
      referralCode = await generateReferralCode();
    } while (referralCode === promoCode); // Ensure the generated referral code is unique and not the same as the promo code

    let referrer;
    if (promoCode) {
      // Validate the provided promo code
      referrer = await User.findOne({ referralCode: promoCode });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid promo code." });
      }
    }

    // Generate verification code for the user
    const { verificationCode, codeExpires } = await emailVerification(email);

    // Prepare user data for registration
    const userData = {
      email,
      dateOfBirth,
      password,
      referralCode,
      isVerified: false,
      referredByCode: promoCode,
      verificationCode,
      codeExpires,
      acceptedTerms: agreeToTerms,
    };

    // Create and save new user
    const user = new User(userData);
    await user.save();

    return res.status(200).json({
      message:
        "Registration successful. Please check your email for the verification code.",
    });
  } catch (error) {
    console.error(error); // Log error to the server console
    res.status(500).json({ message: "Server error." }); // Send server error response
  }
}

// User logout route
export async function logout(req, res) {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // You may also wish to update user session status in the database if needed
    // e.g., setting a "lastLogout" field, etc. That is optional and depends on your requirements.

    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

// User login route
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Apply account lockout logic to prevent brute force attacks
    accountLockout(res, user, 20, 5); // If too many failed attempts, lock the account for a specified time

    // Verify if the provided password matches the user's password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment failed login attempts if password is incorrect
      user.failedLoginAttempts += 1;
      user.lastFailedLogin = new Date();

      await user.save(); // Save the updated failed attempts count
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check if the user account is active
    if (user.status !== "active") {
      return res.status(403).json({ message: "Account is not active." });
    }

    // Ensure the account has not been deleted
    if (user.isDeleted === true) {
      return res.status(403).json({ message: "Account has been deleted." });
    }

    // Ensure the account has not been deleted
    if (user.isLocked === true) {
      return res.status(403).json({ message: "Account is locked." });
    }

    // Reset failed login attempts and update last login timestamp
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date();

    await user.save(); // Save the user's updated login information

    // Generate a JWT token for user authentication
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set the JWT token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access to cookie from JavaScript to enhance security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS only)
      sameSite: "Strict", // Helps mitigate CSRF attacks by restricting the use of cookies
      maxAge: 24 * 60 * 60 * 1000, // Set cookie lifespan to 1 day
    });
    res.status(200).json({ message: "Login successful." }); // Send successful login response
  } catch (error) {
    console.error(error); // Log error to the server console
    res.status(500).json({ message: "Server error." }); // Send server error response
  }
}

// Verify user code for account activation
export async function verifyCode(req, res) {
  try {
    const { email, verificationCode } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      // Return error if no user with the provided email is found
      return res
        .status(400)
        .json({ message: "Invalid email or verification code." });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    // Check if the verification code has expired
    if (user.codeExpires < new Date()) {
      // If the code has expired, optionally delete the user or request re-registration
      await User.deleteOne({ email });
      return res.status(400).json({
        message: "Verification code has expired. Please register again.",
      });
    }

    // Verify if the provided code matches the user's verification code
    if (Number(user.verificationCode) !== Number(verificationCode)) {
      // Return error if the codes do not match
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verificationCode = undefined; // Remove verification code after successful verification
    user.codeExpires = undefined; // Remove code expiration time

    // Save the updated user data
    await user.save();

    // Update the referrer's referredPeople list if applicable
    const referrer = await User.findOne({ referralCode: user.referredByCode });
    if (referrer) {
      referrer.referredPeople.push(user._id);
      await referrer.save(); // Save the updated referrer data
    }

    // Generate JWT token for user authentication
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Respond to the client with a success message and set the token
    res.cookie("token", token, {
      httpOnly: true, // Prevent access to cookie from JavaScript to enhance security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS only)
      sameSite: "Strict", // Helps mitigate CSRF attacks by restricting the use of cookies
      maxAge: 24 * 60 * 60 * 1000, // Set cookie lifespan to 1 day
    });
    res.status(201).json({ message: "User registered successfully." }); // Send success response
  } catch (error) {
    // Log error for debugging
    console.error("Verification error:", error);
    // Send server error response
    res.status(500).json({ message: "Server error." });
  }
}

// Resend verification code controller
export async function resendVerifyCode(req, res) {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Generate a new verification code
    const { verificationCode, codeExpires } = await emailVerification(email);
    user.verificationCode = verificationCode;
    user.codeExpires = codeExpires;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message:
        "A new verification code has been sent. Please check your email.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error." });
  }
}

// Get user account information
export const getAccountInfo = async (req, res) => {
  try {
    // Find the user by ID extracted from the authentication middleware
    const user = await User.findById(req.user.id);

    // If user is not found, respond with 404 Not Found
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Send a 404 response if no user is found
    }

    // Check if user account has been deleted
    if (user.isDeleted === true) {
      return res.status(403).json({ message: "Account has been deleted." });
    }

    // Prepare user information excluding sensitive data like password
    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      dateOfRegistration: user.dateOfRegistration,
      status: user.status,
      lastLogin: user.lastLogin,
      isVerified: user.isVerified,
      preferredLanguage: user.settings.preferredLanguage,
      wantsNotifications: user.settings.wantsNotifications,
      createdAt: user.createdAt,
      isDeleted: user.isDeleted,
      updatedAt: user.updatedAt,
      referralCode: user.referralCode,
      referredByCode: user.referredByCode,
      leagues: user.leagues,
      referredPeople: user.referredPeople,
      paymentInformation: user.paymentInformation,
      acceptedTerms: user.acceptedTerms,
      paymentHistory: user.paymentHistory,
      badges: user.badges,
      prizes: user.prizes,
      failedLoginAttempts: user.failedLoginAttempts,
      lastFailedLogin: user.lastFailedLogin,
      isLocked: user.isLocked,
      idDeleted: user.idDeleted,
    };

    // Send user information as JSON response
    res.status(200).json(userInfo);
  } catch (error) {
    // If error occurs, respond with 500 Internal Server Error
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" }); // Send error response
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    // Find the user by ID extracted from the authentication middleware
    const user = await User.findById(req.user.id);
    // If the user is not found, respond with 404 Not Found
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Send a 404 response if no user is found
    }

    // Mark the user account as deleted
    user.isDeleted = true;
    await user.save(); // Save the updated status to the database

    // Send response confirming the account has been deleted
    res.status(200).json({ message: "The user has been deleted." });
  } catch (error) {
    // If an error occurs, respond with 500 Internal Server Error
    res.status(500).json({
      message: "An error occurred while Deleting User",
      error: error,
    });
  }
};

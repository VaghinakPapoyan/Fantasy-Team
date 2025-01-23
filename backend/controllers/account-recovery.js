// Import External Dependencies
import User from '../models/User.js'
import generateResetToken from '../utils/generateResetToken.js'
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

// Controller to handle password reset request.
export async function requestPasswordReset(req, res) {
	try {
		const { email } = req.body // Extract email from request body

		// Custom validation for email
		if (!email) {
			return res.status(400).json({ message: 'Email is required.' })
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: 'Invalid email format.' })
		}

		// Find user by email
		const user = await User.findOne({ email })
		if (!user) {
			return res
				.status(404)
				.json({ message: 'No account found with this email.' })
		}

		const resetToken = generateResetToken() // Generate a secure reset token

		// Hash the token before storing in the database
		const hashedToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex')

		// Set reset token and expiration on user object
		user.resetPasswordToken = hashedToken
		user.resetPasswordExpires = Date.now() + 3600000 // Token valid for 1 hour

		await user.save() // Save the user with the reset token

		// Construct reset URL to send in email
		const resetUrl = `${process.env.HOST}/reset-password/${resetToken}`

		const emailSubject = 'Password Reset Request' // Email subject
		const emailText = `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.` // Email content

		await sendEmail(user.email, emailSubject, emailText) // Send the reset email

		// Respond with a generic message to prevent email enumeration
		res.status(200).json({
			message: 'Password reset link has been sent.',
		})
	} catch (error) {
		res.status(500).json({ message: 'Server error' }) // Handle server errors
	}
}

// Controller to handle password reset.
export async function resetPassword(req, res) {
	try {
		const { token, password } = req.body // Extract token and new password from request

		// Validate password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
		// Ensure the password meets security requirements
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/\?]).{8,}$/
		if (!passwordRegex.test(password)) {
			console.log(
				'Validation failed: Password does not meet complexity requirements'
			)
			return res.status(400).json({
				message:
					'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
			})
		}

		// Validate Token
		if (!token || typeof token !== 'string') {
			return res.status(400).json({ message: 'Invalid token format' })
		}

		// Hash the token to match it with the hashed token in the database
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

		// Find user with matching reset token and ensure token is not expired
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetPasswordExpires: { $gt: Date.now() }, // Token expiration validation
		})

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token' }) // Handle invalid token
		}

		user.password = password // Set the new password

		// Clear reset token fields
		user.resetPasswordToken = undefined
		user.resetPasswordExpires = undefined

		await user.save() // Save the updated user

		res.status(200).json({ message: 'Password has been reset successfully' }) // Success response
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Server error' }) // Handle server errors
	}
}

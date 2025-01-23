// Validation Middleware for User Registration
export async function validateRegistrationData(req, res, next) {
	try {
		const { email, dateOfBirth, password, promoCode, agreeToTerms } = req.body

		// Validate required fields
		// Ensure all required fields are provided in the request body
		if (!email || !dateOfBirth || !password || agreeToTerms === undefined) {
			console.log('Validation failed: Missing required fields')
			return res.status(400).json({ message: 'All fields are required.' })
		}

		// Validate email format
		// Check if the provided email matches the correct email format
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		if (!emailRegex.test(email)) {
			console.log('Validation failed: Invalid email format for email:', email)
			return res.status(400).json({ message: 'Invalid email format.' })
		}

		// Validate date of birth (must be at least 16 years old)
		// Convert the dateOfBirth string to a Date object
		const userDOB = new Date(dateOfBirth)
		if (isNaN(userDOB.getTime())) {
			// Check if the date is a valid date
			console.log(
				'Validation failed: Invalid date of birth format for dateOfBirth:',
				dateOfBirth
			)
			return res.status(400).json({ message: 'Invalid date of birth format.' })
		}

		// Calculate user's age based on the provided date of birth
		const today = new Date()
		let age = today.getFullYear() - userDOB.getFullYear()
		const monthDifference = today.getMonth() - userDOB.getMonth()
		if (
			monthDifference < 0 ||
			(monthDifference === 0 && today.getDate() < userDOB.getDate())
		) {
			age-- // Adjust age if the current month/day is before the birth month/day
		}

		// Check if the user is at least 16 years old
		if (age < 16) {
			console.log('Validation failed: User is under 16 years old, age:', age)
			return res
				.status(400)
				.json({ message: 'You must be at least 16 years old to register.' })
		}

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

		// Validate agreeToTerms (must be true)
		// Check if the user has agreed to the terms and conditions
		if (!agreeToTerms) {
			console.log(
				'Validation failed: User did not agree to terms and conditions'
			)
			return res
				.status(400)
				.json({ message: 'You must agree to the terms and conditions.' })
		}

		// If promo code is provided, ensure it is a valid format (optional but should be alphanumeric)
		// Validate promo code if provided, ensuring it is between 6 to 10 alphanumeric characters
		if (promoCode && !/^[a-zA-Z0-9]{6,10}$/.test(promoCode)) {
			console.log(
				'Validation failed: Invalid promo code format for promoCode:',
				promoCode
			)
			return res.status(400).json({ message: 'Invalid promo code format.' })
		}

		// If all validations pass, proceed to the next middleware/controller
		next()
	} catch (error) {
		// Handle unexpected errors and return a server error response
		console.error('Validation Middleware Error:', error)
		res.status(500).json({ message: 'Server error during validation.' })
	}
}

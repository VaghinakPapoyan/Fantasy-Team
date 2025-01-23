// Import External Dependencies
import bcrypt from 'bcrypt'

// Define the number of salt rounds for bcrypt
const SALT_ROUNDS = 10

// Function to hash the password
export const hash = async function (next) {
	try {
		// Only hash the password if it has been modified or is new
		if (!this.isModified('password')) return next()

		// Generate a salt and hash the password
		const salt = await bcrypt.genSalt(SALT_ROUNDS)
		// Hash the password using the generated salt
		this.password = await bcrypt.hash(this.password, salt)

		// Continue to the next middleware function
		next()
	} catch (error) {
		// Handle any errors and pass them to the next middleware
		next(error)
	}
}

// Method to compare given password with the hashed password
export const compare = function (candidatePassword) {
	// Compare the input password with the stored hashed password
	return bcrypt.compare(candidatePassword, this.password)
}

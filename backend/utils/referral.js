// Import User model from the models directory
import User from '../models/User.js'

/**
 * Function to generate a unique referral code.
 * The referral code is generated using random alphanumeric characters,
 * and the function ensures the generated code is unique by checking
 * against the existing codes in the database.
 */
export async function generateReferralCode() {
	let code
	let exists = true

	// Keep generating a new code until a unique one is found
	while (exists) {
		// Generate a random alphanumeric string of 9 characters
		code = Math.random().toString(36).substr(2, 9)

		// Check if a user with the generated referral code already exists
		exists = await User.findOne({ referralCode: code })
	}

	// Return the unique referral code
	return code
}

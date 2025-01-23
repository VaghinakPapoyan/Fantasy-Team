import crypto from 'crypto' // Node.js crypto module for secure token generation

// Function to generate a secure random token
export default function generateResetToken() {
	// Generate a 32-byte random string and convert it to hexadecimal format
	return crypto.randomBytes(32).toString('hex')
}

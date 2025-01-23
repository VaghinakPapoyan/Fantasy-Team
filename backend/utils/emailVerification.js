import generateEmailVerificationCode from './generateEmailVerificationCode.js'
import sendVerificationEmail from './sendEmail.js'

export default async function emailVerification(email) {
	// Generate a 4-digit verification code
	const verificationCode = generateEmailVerificationCode()

	// Set code expiration time (e.g., 15 minutes from now)
	const codeExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

	// Send the verification code to the user's email
	const emailSubject = 'Email Verification Code'
	const emailText = `Your verification code is: ${verificationCode}`
	await sendVerificationEmail(email, emailSubject, emailText)
	return { verificationCode, codeExpires }
}
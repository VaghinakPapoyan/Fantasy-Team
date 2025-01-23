export default function generateEmailVerificationCode() {
	// return number from 1000 to 9999
	return Math.floor(1000 + Math.random() * 9000).toString()
}

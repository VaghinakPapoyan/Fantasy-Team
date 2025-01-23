export default async function accountLockout(
	res,
	user,
	lockoutTime = 20,
	maxFailedAttempts
) {
	lockoutTime = lockoutTime * 60 * 1000 // Lockout period: default 20 minutes

	// Lock account if failed attempts exceed threshold
	if (user.failedLoginAttempts >= maxFailedAttempts) {
		user.isLocked = true
	}

	// Check if user account is locked
	if (user.isLocked) {
		const timeSinceLastAttempt = Date.now() - user.lastFailedLogin

		// Check if lockout period has passed
		if (timeSinceLastAttempt < lockoutTime) {
			return res.status(403).json({
				message: 'Account is temporarily locked. Please try again later.',
			})
		}

		// Reset failed attempts if lockout time has passed
		user.failedLoginAttempts = 0
		user.isLocked = false
		await user.save()
	}
}

// Export a middleware function that checks for required roles
const authorize = function (requiredRoles) {
	return (req, res, next) => {
		// If user's role is not in the list of required roles
		if (!requiredRoles.includes(req.user.role)) {
			// Respond with 403 Forbidden
			return res.status(403).send('Forbidden')
		}

		// Proceed to the next middleware or route handler
		next()
	}
}
export default authorize

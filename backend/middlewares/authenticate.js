// Import External Dependencies
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Export middleware function for authentication
export default function authenticate(req, res, next) {
	// Retrieve the token from the 'Authorization' header, splitting the string and getting the second part
	const token = req.cookies['token']
	console.log(token)
	console.log(req.cookies)

	// If no token is provided, send a 401 Unauthorized response
	if (!token) return res.status(401).send('Access Denied. No token provided.')

	try {
		// Verify the token using the JWT secret
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		// Attach the decoded token data to the request object
		req.user = decoded

		// Proceed to the next middleware function
		next()
	} catch (err) {
		// Handle expired token error specifically
		if (err.name === 'TokenExpiredError') {
			return res.status(401).send('Token has expired.')
		}
		// Handle invalid token error
		if (err.name === 'JsonWebTokenError') {
			return res.status(400).send('Invalid token.')
		}
		// Handle any other errors
		res.status(400).send('Authentication error.')
	}
}

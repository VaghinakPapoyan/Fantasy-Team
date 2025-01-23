// Import External Dependencies
import rateLimit from 'express-rate-limit'

// Apply rate limiting to all requests
const limiter = (minutes = 15, limit = 100) =>
	rateLimit({
		windowMs: minutes * 60 * 1000, // default: 15 minutes
		max: limit, // limit each IP to (default) 100 requests per windowMs
	})

// Export Limiter
export default limiter

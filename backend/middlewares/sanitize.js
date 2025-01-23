function sanitizeObject(obj) {
	// Loop through each key in the object
	for (let key in obj) {
		// Ensure the object has the property (avoids inherited properties)
		if (Object.hasOwnProperty.call(obj, key)) {
			const value = obj[key]

			// Check if the key contains prohibited characters ('$' or '.')
			if (key.startsWith('$') || key.includes('.')) {
				// If the key is unsafe, delete it
				delete obj[key]
			} else if (typeof value === 'object' && value !== null) {
				// If the value is another object, recursively sanitize it
				sanitizeObject(value)
			}
		}
	}
}

function sanitize(req, res, next) {
	// Sanitize req.body if it exists
	if (req.body) {
		sanitizeObject(req.body)
	}
	// Sanitize req.query if it exists
	if (req.query) {
		sanitizeObject(req.query)
	}
	// Sanitize req.params if it exists
	if (req.params) {
		sanitizeObject(req.params)
	}

	// Proceed to the next middleware or route handler
	next()
}

// Export the customMongoSanitize function for use in other modules
export default sanitize

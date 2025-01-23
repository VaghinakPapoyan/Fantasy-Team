// Middleware function to handle errors in the application
export default function errorHandler(err, req, res, next) {
	// Log the complete error stack trace to the server console for debugging purposes
	console.error(err.stack)

	// Send a response with HTTP status code 500 indicating a server error
	// 'Something broke!' is sent as a simple error message to the client
	res.status(500).send('Something broke!')
}

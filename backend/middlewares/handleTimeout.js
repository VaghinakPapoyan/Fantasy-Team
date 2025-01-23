// Middleware to handle timeouts. If the request hasn't timed out, proceed to the next middleware.
export default function handleTimeouts(req, res, next) {
	if (!req.timedout) next()
}

//! I need to add csrf protection
// Import External Dependencies
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import timeout from 'connect-timeout'
import hpp from 'hpp'

// implement passport

// Import Internal Dependencies
import routes from './routes/routes.js'
import sanitize from './middlewares/sanitize.js'
import rateLimiter from './middlewares/rate-limiter.js'
import errorHandler from './middlewares/error-handler.js'
import handleTimeout from './middlewares/handleTimeout.js'

// Initialize Environment Variables
dotenv.config()

// Create Express App
const app = express()

// Middlewares
app.use(morgan('dev')) // Log requests in development mode
// Setting HTTP headers properly
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
		},
	})
)

app.use(
	cors({
		origin: ['http://localhost:3001', 'http://localhost:3000'],
		credentials: true,
	})
) // Allow cross-origin requests
app.use(rateLimiter(15, 100 * process.env.RateLimitMultiply)) // Limit each IP to x requests per y minutes
// app.use(timeout('5s')) // Set response timeout to 5 seconds
app.use(handleTimeout) // handle the timeout
app.use(express.json({ limit: '1000kb' })) // Parse incoming JSON requests and limit to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })) // Parse URL-encoded data (form submissions) and limit to 10kb
app.use(cookieParser())
app.use(hpp()) // Protect against HTTP Parameter Pollution attacks
app.use(sanitize) // sanitize incoming data to prevent SQL injection attacks
app.use(compression()) // Response Compression

// Routes
app.use('/api/v1', routes)

// Database Connection (MongoDB)
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error(err))

// Get Port
const PORT = process.env.PORT || 5000

// Start Server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

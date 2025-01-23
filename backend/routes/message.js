// Import External Dependencies
import express from 'express'
import rateLimiter from '../middlewares/rate-limiter.js'
import dotenv from 'dotenv'

// Import Internal Dependencies
import authenticate from '../middlewares/authenticate.js'
import authorize from '../middlewares/authorize.js'

import { sendMessage, getMessages } from '../controllers/message.js'

// Load environment variables from .env file
dotenv.config()

// Create a new router instance
const messageRouter = express.Router()

messageRouter.post(
	'/',
	rateLimiter(15, 20 * process.env.RateLimitMultiply),
	authenticate,
	sendMessage
)

// Route to get messages
messageRouter.get('/', authenticate, getMessages)

// Export the router for use in other files
export default messageRouter

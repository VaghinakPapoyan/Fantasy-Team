// Import External Dependencies
import express from 'express'

// Import Internal Dependencies
import userRoutes from './user.js'
import leagueRoutes from './league.js'
import userLeagueRoutes from './user-league.js'
import messageRoutes from './message.js'

// Create a new router instance
const mainRouter = express.Router()

// Register user routes under the '/users' path
mainRouter.use('/users', userRoutes)
mainRouter.use('/leagues', leagueRoutes)
mainRouter.use('/user-leagues', userLeagueRoutes)
mainRouter.use('/messages', messageRoutes)

// Export the router for use in other files
export default mainRouter

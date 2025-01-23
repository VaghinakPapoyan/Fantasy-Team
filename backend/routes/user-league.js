// Import External Dependencies
import express from 'express'

// Import Internal Dependencies
import authenticate from '../middlewares/authenticate.js'
import authorize from '../middlewares/authorize.js'

import {
	createBadge,
	updateBadge,
	deleteBadge,
	getBadgeById,
	getAllBadges,
	createBooster,
	updateBooster,
	deleteBooster,
	getBoosterById,
	getAllBoosters,
	createPrize,
	updatePrize,
	deletePrize,
	getPrizeById,
	getAllPrizes,
	getUserLeague,
	updateUserLeague,
} from '../controllers/user-league.js'
// import { generateEmblem, submitEmblem } from '../controllers/emblem.js'

// Create a new router instance
const userLeagueRouter = express.Router()

userLeagueRouter.get('/badge/all', authenticate, getAllBadges)
userLeagueRouter.get('/badge/:badgeId', authenticate, getBadgeById)
userLeagueRouter.post(
	'/admin/badge',
	authenticate,
	authorize(['super-admin']),
	createBadge
)
userLeagueRouter.put(
	'/admin/badge/:id',
	authenticate,
	authorize(['super-admin']),
	updateBadge
)
userLeagueRouter.delete(
	'/admin/badge/:id',
	authenticate,
	authorize(['super-admin']),
	deleteBadge
)
userLeagueRouter.get('/booster/all', authenticate, getAllBoosters)
userLeagueRouter.get('/booster/:boosterId', authenticate, getBoosterById)
userLeagueRouter.post(
	'/admin/booster',
	authenticate,
	authorize(['super-admin']),
	createBooster
)
userLeagueRouter.put(
	'/admin/booster/:id',
	authenticate,
	authorize(['super-admin']),
	updateBooster
)
userLeagueRouter.delete(
	'/admin/booster/:id',
	authenticate,
	authorize(['super-admin']),
	deleteBooster
)

userLeagueRouter.get('/prize/all', authenticate, getAllPrizes)
userLeagueRouter.get('/prize/:prizeId', authenticate, getPrizeById)
userLeagueRouter.post(
	'/admin/prize',
	authenticate,
	authorize(['super-admin']),
	createPrize
)
userLeagueRouter.put(
	'/admin/prize/:id',
	authenticate,
	authorize(['super-admin']),
	updatePrize
)
userLeagueRouter.delete(
	'/admin/prize/:id',
	authenticate,
	authorize(['super-admin']),
	deletePrize
)

userLeagueRouter.get(
	'/:userId/:leagueId',
	authenticate,
	authorize(['super-admin']),
	getUserLeague
)

userLeagueRouter.put(
	'/:userId/:leagueId',
	authenticate,
	authorize(['super-admin']),
	updateUserLeague
)

// userLeagueRouter.post('/generate-emblem', authenticate, generateEmblem)

// Endpoint to save the emblem
// userLeagueRouter.post('/save-emblem', authenticate, submitEmblem)

// Export the router for use in other files
export default userLeagueRouter

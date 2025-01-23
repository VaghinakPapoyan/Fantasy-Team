// Import External Dependencies
import express from 'express'

// Import Internal Dependencies
import authenticate from '../middlewares/authenticate.js'
import authorize from '../middlewares/authorize.js'
import {
	getInfoAboutLeague, // Controller to get detailed information about a specific league
	getAllClubsInLeague, // Controller to get all clubs associated with a specific league
	getAllPlayersInLeague, // Controller to get all players in a specific league
	getAllUsersInLeague, // Controller to get all users in a specific league
	getAllLeagues, // Controller to get all leagues
	getClubInfo, // Controller to get detailed information about a specific club
	getPlayerInfo, // Controller to get detailed information about a specific player
	deleteLeague, // Controller to delete a league by its ID
	editLeague, // Controller to edit details of a league by its ID
	deleteClub, // Controller to delete a club by its ID
	editClub, // Controller to edit details of a club by its ID
	deletePlayer, // Controller to delete a player by their ID
	editPlayer, // Controller to edit details of a player by their ID
	getAllLeagueNames, // Controller to get names of all leagues (simplified data)
	getLeagueBoosters, // Controller to get all boosters from a league
	getAllPlayerNamesInLeague, // Controller to get all players names from a league
} from '../controllers/league.js'

// Controllers
import leagueSync from '../controllers/leagueSync.js' // Controller to sync league data with external sources

// Create a new router instance
const leagueRouter = express.Router()

// Admin route to sync league data with external sources
leagueRouter.post(
	'/admin/sync',
	authenticate, // Middleware to authenticate the user
	authorize(['super-admin']), // Middleware to authorize access to 'super-admin' users
	leagueSync // Controller that performs the sync operation
)

// Public routes to access league data
leagueRouter.get('/all', getAllLeagues) // Get all leagues with detailed information
leagueRouter.get('/all-names', getAllLeagueNames) // Get only the names of all leagues
leagueRouter.get('/clubs/all/:id', getAllClubsInLeague) // Get all clubs in a specific league by league ID
leagueRouter.get('/players/all/:id', getAllPlayersInLeague) // Get all players in a specific league by league ID
leagueRouter.get('/players/all-names/:id', getAllPlayerNamesInLeague) // Get all players in a specific league by league ID

leagueRouter.get('/users/:id', getAllUsersInLeague) // Get all users associated with a specific league by league ID
leagueRouter.get('/:id', getInfoAboutLeague) // Get detailed information about a specific league by league ID
leagueRouter.get('/clubs/:id', getClubInfo) // Get detailed information about a specific club by club ID
leagueRouter.get('/players/:id', getPlayerInfo) // Get detailed information about a specific player by player ID
leagueRouter.get('/boosters/:leagueId', getLeagueBoosters) // Get detailed information about a specific player by player ID

// Admin routes to manage leagues, clubs, and players
leagueRouter.delete(
	'/admin/:leagueId',
	authenticate, // Middleware to authenticate the user
	authorize(['super-admin']), // Middleware to authorize access to 'super-admin' users
	deleteLeague // Controller to delete a specific league by league ID
)
leagueRouter.put(
	'/admin/:leagueId',
	authenticate, // Middleware to authenticate the user
	authorize(['super-admin']), // Middleware to authorize access to 'super-admin' users
	editLeague // Controller to edit a specific league by league ID
)

leagueRouter.delete(
	'/admin/players/:playerId',
	authenticate, // Middleware to authenticate the user
	authorize(['super-admin']), // Middleware to authorize access to 'super-admin' users
	deletePlayer // Controller to delete a specific player by player ID
)
leagueRouter.put(
	'/admin/players/:playerId',
	authenticate, // Middleware to authenticate the user
	authorize(['super-admin']), // Middleware to authorize access to 'super-admin' users
	editPlayer // Controller to edit a specific player by player ID
)

leagueRouter.delete(
	'/admin/clubs/:clubId',
	authenticate, // Middleware to authenticate the user
	authorize(['super-admin']), // Middleware to authorize access to 'super-admin' users
	deleteClub // Controller to delete a specific club by club ID
)
leagueRouter.put(
	'/admin/clubs/:clubId',
	authenticate, // Middleware to authenticate the user
	authorize(['super-admin']), // Middleware to authorize access to 'super-admin' users
	editClub // Controller to edit a specific club by club ID
)

// Export the router for use in other files
export default leagueRouter

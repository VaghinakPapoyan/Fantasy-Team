// Import the League, Club, and FootballPlayer models
import League from '../models/league.js'
import Club from '../models/club.js'
import FootballPlayer from '../models/FootballPlayer.js'
import Booster from '../models/Booster.js'
import mongoose from 'mongoose'

/**
 * Controller to get information about a specific league
 */
const getInfoAboutLeague = async (req, res) => {
	try {
		// Extract leagueId from the route parameters
		const leagueId = req.params.id

		// Find the league by its ID
		const league = await League.findOne({ _id: leagueId }).populate('clubs')

		// Check if the league exists
		if (!league) {
			// If the league does not exist, send a 404 Not Found response
			return res.status(404).json({ message: 'League not found' })
		}

		// Send the league information as a JSON response
		res.status(200).json(league)
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching league information:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get all players in a league
 */
const getAllPlayersInLeague = async (req, res) => {
	try {
		// Extract leagueId from the route parameters
		const leagueId = req.params.id

		// Find the league and populate the 'players' field
		const league = await League.findOne({ _id: leagueId }).populate('players')

		// Check if the league exists
		if (!league) {
			// If the league does not exist, send a 404 Not Found response
			return res.status(404).json({ message: 'League not found' })
		}

		// Check if the league has any players
		if (!league.players || league.players.length === 0) {
			// If no players are found, send a 200 OK response with an empty array
			return res
				.status(200)
				.json({ message: 'No players found in this league', players: [] })
		}

		// Send the list of players as a JSON response
		res.status(200).json(league.players)
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching players in league:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get all players in a league
 */
const getAllPlayerNamesInLeague = async (req, res) => {
	try {
		const leagueId = req.params.id

		// Find the league and populate the 'players' field
		const players = await League.findOne({ _id: leagueId })
			.select('players')
			.populate({
				path: 'players',
				select: 'playerName _id', // Only fetch playername and _id for players
			})
			.lean()

		// Check if the league has any players
		if (!players || players.length === 0) {
			// If no players are found, send a 200 OK response with an empty array
			return res
				.status(200)
				.json({ message: 'No players found in this league', players: [] })
		}

		res.status(200).json(players)
	} catch (error) {
		console.error('Error fetching players in league:', error)
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get all clubs in a league
 */
const getAllClubsInLeague = async (req, res) => {
	try {
		// Extract leagueId from the route parameters
		const leagueId = req.params.id

		// Find the league and populate the 'clubs' field
		const league = await League.findOne({ _id: leagueId }).populate('clubs')

		// Check if the league exists
		if (!league) {
			// If the league does not exist, send a 404 Not Found response
			return res.status(404).json({ message: 'League not found' })
		}

		// Check if the league has any clubs
		if (!league.clubs || league.clubs.length === 0) {
			// If no clubs are found, send a 200 OK response with an empty array
			return res
				.status(200)
				.json({ message: 'No clubs found in this league', clubs: [] })
		}

		// Send the list of clubs as a JSON response
		res.status(200).json(league.clubs)
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching clubs in league:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get all users in a league
 */
const getAllUsersInLeague = async (req, res) => {
	try {
		// Extract leagueId from the route parameters
		const leagueId = req.params.id

		// Find the league and populate the 'users' field with selected fields (username and email)
		const league = await League.findOne({ _id: leagueId }).populate(
			'users',
			'firstName lastName dateOfRegistration email role'
		)

		// Check if the league exists
		if (!league) {
			// If the league does not exist, send a 404 Not Found response
			return res.status(404).json({ message: 'League not found' })
		}

		// Check if the league has any users
		if (!league.users || league.users.length === 0) {
			// If no users are found, send a 200 OK response with an empty array
			return res
				.status(200)
				.json({ message: 'No users found in this league', users: [] })
		}

		// Send the list of users as a JSON response
		res.status(200).json(league.users)
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching users in league:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get all leagues
 */
const getAllLeagues = async (req, res) => {
	try {
		// Fetch all leagues from the database
		const leagues = await League.find()

		// Check if leagues exist
		if (!leagues || leagues.length === 0) {
			// If no leagues are found, send a 200 OK response with an empty array
			return res.status(200).json({ message: 'No leagues found', leagues: [] })
		}

		// Send the list of leagues as a JSON response
		res.status(200).json(leagues)
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching leagues:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get basic information of all leagues (name and ID)
 */
const getAllLeagueNames = async (req, res) => {
	try {
		// Fetch all leagues with only their name and _id fields
		const leagues = await League.find().select('leagueName _id')

		// Check if leagues exist
		if (!leagues || leagues.length === 0) {
			// If no leagues are found, send a 200 OK response with an empty array
			return res.status(200).json({ message: 'No leagues found', leagues: [] })
		}

		// Send the list of league names as a JSON response
		res.status(200).json(leagues)
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching leagues:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get information about a specific club
 */
const getClubInfo = async (req, res) => {
	try {
		// Find the club by its ID and populate the players field
		const club = await Club.findById(req.params.id).populate('players')

		// Check if the club exists
		if (club) {
			// Send the club information as a JSON response
			res.json(club)
		} else {
			// If the club does not exist, send a 404 Not Found response
			res.status(404).json({ message: 'Club not found' })
		}
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching club information:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to get information about a specific player
 */
const getPlayerInfo = async (req, res) => {
	try {
		// Find the player by their ID and populate the team field
		const player = await FootballPlayer.findById(req.params.id).populate('team')

		// Check if the player exists
		if (player) {
			// Send the player information as a JSON response
			res.json(player)
		} else {
			// If the player does not exist, send a 404 Not Found response
			res.status(404).json({ message: 'Player not found' })
		}
	} catch (error) {
		// Log any errors that occur during the process
		console.error('Error fetching player information:', error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error' })
	}
}

/**
 * Controller to delete a league by ID
 */
async function deleteLeague(req, res) {
	try {
		// Extract leagueId from the route parameters
		const { leagueId } = req.params

		// Validate that leagueId is provided
		if (!leagueId) {
			return res.status(400).json({ message: 'League ID is required.' })
		}

		// Find and delete the league by ID
		const league = await League.findByIdAndDelete(leagueId)
		if (!league) {
			// If the league does not exist, send a 404 Not Found response
			return res.status(404).json({ message: 'League not found.' })
		}

		// Send success response after deleting the league
		res.status(200).json({ message: 'League deleted successfully.' })
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error.' })
	}
}

/**
 * Controller to edit a league by ID
 */
async function editLeague(req, res) {
	try {
		// Extract leagueId from the route parameters
		const { leagueId } = req.params
		if (!leagueId) {
			return res.status(400).json({ message: 'League ID is required.' })
		}

		// Find the league by ID
		const league = await League.findById(leagueId)
		if (!league) {
			return res.status(404).json({ message: 'League not found.' })
		}

		// Destructure fields from request body and update if provided
		const {
			leagueName,
			leagueType,
			status,
			country,
			season,
			transferLimit,
			startDate,
			endDate,
			timezone,
			gameWeeks,
			description,
			price,
			entryDeadline,
			apiProvider,
			lastSyncTime,
			syncFrequency,
			players,
			clubs,
			users,
			winners,
			prizes,
			imageLink,
			boosters,
			closed,
		} = req.body

		// Update the league fields accordingly
		if (leagueName) league.leagueName = leagueName
		if (leagueType) league.leagueType = leagueType
		if (status) league.status = status
		if (country) league.country = country
		if (season) league.season = season
		if (transferLimit !== undefined) league.transferLimit = transferLimit
		if (startDate) league.startDate = startDate
		if (endDate) league.endDate = endDate
		if (timezone) league.timezone = timezone
		if (gameWeeks) league.gameWeeks = gameWeeks
		if (description) league.description = description
		if (price !== undefined) league.price = price
		if (entryDeadline) league.entryDeadline = entryDeadline
		if (apiProvider) league.apiProvider = apiProvider
		if (lastSyncTime) league.lastSyncTime = lastSyncTime
		if (syncFrequency !== undefined) league.syncFrequency = syncFrequency
		if (players) league.players = players
		if (clubs) league.clubs = clubs
		if (users) league.users = users
		if (winners) league.winners = winners
		if (prizes) league.prizes = prizes
		if (imageLink) league.imageLink = imageLink
		if (boosters) league.boosters = boosters
		if (closed !== undefined) league.closed = closed

		let validatedBoosters = []
		if (boosters.length > 0) {
			// Validate booster IDs
			const boosterIds = boosters.filter(boosterId =>
				mongoose.Types.ObjectId.isValid(boosterId)
			)

			// Check if all provided booster IDs exist
			validatedBoosters = await Booster.find({
				_id: { $in: boosterIds },
			})

			if (validatedBoosters.length !== boosterIds.length) {
				return res
					.status(400)
					.json({ message: 'One or more booster IDs are invalid' })
			}
		}

		// Handle booster associations
		if (validatedBoosters.length > 0) {
			// Remove league from previously associated boosters
			await Booster.updateMany(
				{ leagues: leagueId },
				{ $pull: { leagues: leagueId } }
			)

			// Update league's boosters
			league.boosters = validatedBoosters.map(booster => booster._id)

			// Add league to new boosters
			await Booster.updateMany(
				{ _id: { $in: validatedBoosters.map(booster => booster._id) } },
				{ $addToSet: { leagues: leagueId } }
			)
		}

		// Save the updated league
		const updatedLeague = await league.save()
		res.status(200).json(updatedLeague)
	} catch (error) {
		// Handle duplicate key error if occurs
		if (error.code === 11000) {
			res.status(400).json({ message: 'Duplicate key error' })
		} else {
			// Log any other errors and send server error response
			console.error(error)
			res.status(500).json({ message: 'Server error.' })
		}
	}
}

/**
 * Controller to delete a club by ID
 */
async function deleteClub(req, res) {
	try {
		// Extract clubId from the route parameters
		const { clubId } = req.params

		// Validate that clubId is provided
		if (!clubId) {
			return res.status(400).json({ message: 'Club ID is required.' })
		}

		// Find and delete the club by ID
		const club = await Club.findByIdAndDelete(clubId)
		if (!club) {
			// If the club does not exist, send a 404 Not Found response
			return res.status(404).json({ message: 'Club not found.' })
		}

		// Send success response after deleting the club
		res.status(200).json({ message: 'Club deleted successfully.' })
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error.' })
	}
}

/**
 * Controller to edit a club by ID
 */
async function editClub(req, res) {
	try {
		// Extract clubId from the route parameters
		const { clubId } = req.params
		if (!clubId) {
			return res.status(400).json({ message: 'Club ID is required.' })
		}

		// Find the club by ID
		const club = await Club.findById(clubId)
		if (!club) {
			return res.status(404).json({ message: 'Club not found.' })
		}

		// Destructure fields from request body and update if provided
		const {
			clubName,
			shortName,
			tla,
			crestUrl,
			address,
			phone,
			website,
			email,
			founded,
			clubColors,
			venue,
			players,
			lastUpdated,
		} = req.body

		// Update the club fields accordingly
		if (clubName) club.clubName = clubName
		if (shortName) club.shortName = shortName
		if (tla) club.tla = tla
		if (crestUrl) club.crestUrl = crestUrl
		if (address) club.address = address
		if (phone) club.phone = phone
		if (website) club.website = website
		if (email) club.email = email
		if (founded !== undefined) club.founded = founded
		if (clubColors) club.clubColors = clubColors
		if (venue) club.venue = venue
		if (players) club.players = players
		if (lastUpdated) club.lastUpdated = lastUpdated

		// Save the updated club
		const updatedClub = await club.save()
		res.status(200).json(updatedClub)
	} catch (error) {
		// Handle duplicate key error if occurs
		if (error.code === 11000) {
			res.status(400).json({ message: 'Duplicate key error' })
		} else {
			// Log any other errors and send server error response
			console.error(error)
			res.status(500).json({ message: 'Server error.' })
		}
	}
}

/**
 * Controller to delete a player by ID
 */
async function deletePlayer(req, res) {
	try {
		// Extract playerId from the route parameters
		const { playerId } = req.params

		// Validate that playerId is provided
		if (!playerId) {
			return res.status(400).json({ message: 'Player ID is required.' })
		}

		// Find and delete the player by ID
		const player = await FootballPlayer.findByIdAndDelete(playerId)
		if (!player) {
			// If the player does not exist, send a 404 Not Found response
			return res.status(404).json({ message: 'Player not found.' })
		}

		// Send success response after deleting the player
		res.status(200).json({ message: 'Player deleted successfully.' })
	} catch (error) {
		// Log any errors that occur during the process
		console.error(error)

		// Send a 500 Internal Server Error response
		res.status(500).json({ message: 'Server error.' })
	}
}

/**
 * Controller to edit a player by ID
 */
async function editPlayer(req, res) {
	try {
		// Extract playerId from the route parameters
		const { playerId } = req.params
		if (!playerId) {
			return res.status(400).json({ message: 'Player ID is required.' })
		}

		// Find the player by ID
		const player = await FootballPlayer.findById(playerId)
		if (!player) {
			return res.status(404).json({ message: 'Player not found.' })
		}

		// Destructure fields from request body and update if provided
		const {
			playerName,
			position,
			dateOfBirth,
			countryOfBirth,
			nationality,
			shirtNumber,
			role,
			team,
			lastUpdated,
		} = req.body

		// Update the player fields accordingly
		if (playerName) player.playerName = playerName
		if (position) player.position = position
		if (dateOfBirth) player.dateOfBirth = dateOfBirth
		if (countryOfBirth) player.countryOfBirth = countryOfBirth
		if (nationality) player.nationality = nationality
		if (shirtNumber !== undefined) player.shirtNumber = shirtNumber
		if (role) player.role = role
		if (team) player.team = team
		if (lastUpdated) player.lastUpdated = lastUpdated

		// Save the updated player
		const updatedPlayer = await player.save()
		res.status(200).json(updatedPlayer)
	} catch (error) {
		// Handle duplicate key error if occurs
		if (error.code === 11000) {
			res.status(400).json({ message: 'Duplicate key error' })
		} else {
			// Log any other errors and send server error response
			console.error(error)
			res.status(500).json({ message: 'Server error.' })
		}
	}
}

const getLeagueBoosters = async (req, res) => {
	try {
		const { leagueId } = req.params // Extract league ID from query parameters

		if (!leagueId) {
			return res.status(400).json({ error: 'League ID is required.' })
		}

		// Fetch boosters with the given leagueId, populated with league details
		const boosters = await Booster.find({ leagues: leagueId })
			.populate('leagues', 'name logo') // Replace 'name logo' with the desired fields from the League model
			.exec()

		if (boosters.length === 0) {
			return res
				.status(404)
				.json({ message: 'No boosters found for this league.' })
		}

		res.status(200).json(boosters)
	} catch (error) {
		console.error('Error fetching league boosters:', error)
		res.status(500).json({ error: 'Server error. Please try again later.' })
	}
}

// Export the controllers to be used in your routes
export {
	getInfoAboutLeague,
	getAllPlayersInLeague,
	getAllClubsInLeague,
	getAllUsersInLeague,
	getAllLeagues,
	getClubInfo,
	getPlayerInfo,
	deleteLeague,
	editLeague,
	deleteClub,
	editClub,
	deletePlayer,
	editPlayer,
	getAllLeagueNames,
	getLeagueBoosters,
	getAllPlayerNamesInLeague,
}

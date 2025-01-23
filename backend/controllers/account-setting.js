import User from '../models/User.js'
import UserLeagueInfo from '../models/UserLeague.js' // Adjust the path as needed
import League from '../models/League.js'
import mongoose from 'mongoose'

export const changeLanguagePreferences = async (req, res) => {
	try {
		// Find the user by their ID from the request
		const user = await User.findById(req.user.id)
		// If the user is not found, respond with 404 Not Found
		if (!user) {
			return res.status(404).json({ error: 'User not found' }) // Send a 404 response in JSON format if no user is found
		}

		// Extract the preferredLanguage from the request body
		const { preferredLanguage } = req.body

		// Check if preferredLanguage is provided in the request body
		if (!preferredLanguage) {
			return res
				.status(400)
				.json({ message: 'Preferred language is required.' }) // Send a 400 response if preferredLanguage is not provided
		}

		// Update the user's preferred language in their settings
		user.settings.preferredLanguage = preferredLanguage
		// Save the updated user document to the database
		await user.save()

		// Send a success response with status 200
		res.status(200).json({ message: 'The language has been changed.' })
	} catch (error) {
		// Log the error to the console for debugging purposes
		console.log(error)

		// Send a 500 response indicating an internal server error
		res.status(500).json({
			message: 'An error occurred while changing the language',
			error: error,
		})
	}
}

export const changeNotificationPreferences = async (req, res) => {
	try {
		// Find the user by their ID from the request
		const user = await User.findById(req.user.id)
		// If the user is not found, respond with 404 Not Found
		if (!user) {
			return res.status(404).json({ error: 'User not found' }) // Send a 404 response in JSON format if no user is found
		}

		// Extract wantsNotifications from the request body
		const { wantsNotifications } = req.body

		// Check if wantsNotifications is provided in the request body
		if (wantsNotifications === undefined) {
			return res
				.status(400)
				.json({ message: 'Preferred notification is required.' }) // Send a 400 response if wantsNotifications is not provided
		}

		// Update the user's notification preferences in their settings
		user.settings.wantsNotifications = wantsNotifications
		// Save the updated user document to the database
		await user.save()

		// Send a success response with status 200
		res.status(200).json({ message: 'The language has been changed.' })
	} catch (error) {
		// Log the error to the console for debugging purposes
		console.log(error)

		// Send a 500 response indicating an internal server error
		res.status(500).json({
			message: 'An error occurred while changing the language',
			error: error,
		})
	}
}

/**
 * Controller to handle user joining a league.
 * This function adds the user to the league's users array,
 * adds the league to the user's leagues array,
 * and creates a UserLeagueInfo document for the user in the league.
 * All operations are performed within a transaction to ensure data consistency.
 */
export const joinLeague = async (req, res) => {
	// Start a MongoDB session for transaction
	const session = await mongoose.startSession()

	try {
		// Start transaction
		session.startTransaction()

		// Get user ID from authentication middleware
		const userId = req.user.id

		// Get league ID from request body
		const { leagueId } = req.body

		// Validate that leagueId is provided
		if (!leagueId) {
			await session.abortTransaction()
			return res.status(400).json({ message: 'League ID is required' })
		}

		// Check if the league exists
		const league = await League.findById(leagueId).session(session)
		if (!league) {
			await session.abortTransaction()
			return res.status(404).json({ message: 'League not found' })
		}

		// Check if the user exists
		const user = await User.findById(userId).session(session)
		if (!user) {
			await session.abortTransaction()
			return res.status(404).json({ message: 'User not found' })
		}

		// Check if the user is already in the league
		if (league.users.includes(userId)) {
			await session.abortTransaction()
			return res
				.status(400)
				.json({ message: 'User is already a member of this league' })
		}

		// Add user to the league's users array
		await League.findByIdAndUpdate(
			leagueId,
			{ $addToSet: { users: userId } },
			{ new: true, session }
		)

		// Add league to the user's leagues array
		await User.findByIdAndUpdate(
			userId,
			{ $addToSet: { leagues: leagueId } },
			{ new: true, session }
		)

		// Check if a UserLeagueInfo document already exists for this user and league
		const existingUserLeagueInfo = await UserLeagueInfo.findOne({
			userId,
			leagueId,
		}).session(session)
		if (existingUserLeagueInfo) {
			await session.abortTransaction()
			return res.status(400).json({
				message: 'UserLeagueInfo already exists for this user in this league',
			})
		}

		// Initialize all properties for UserLeagueInfo
		const userLeagueInfo = new UserLeagueInfo({
			userId, // Reference to the user
			leagueId, // Reference to the league
			teamName: `${user.username}'s Team`, // Default team name based on user's username
			teamLogo: '', // Empty team logo
			currentPoints: 0, // Starting with zero points
			currentRank: null, // Rank will be calculated later
			activity: 0, // No activity yet
			isActive: true, // User is active in the league
			joinedAt: Date.now(), // Timestamp of joining
			lastUpdated: Date.now(), // Timestamp of last update
			lastActiveAt: Date.now(), // Timestamp of last activity
			allBoosters: [], // No boosters assigned yet
			badges: [], // No badges earned yet
			headToHeadStats: {
				winRate: 0, // Initial win rate
				streaks: {
					currentStreak: 0, // No current streak
					bestStreak: 0, // No best streak yet
				},
			},
			notifications: [], // No notifications yet
			weekNumber: 0, // Starting week number
			gameWeeks: [], // No gameweek data yet
		})

		// Save the UserLeagueInfo document to the database within the transaction
		await userLeagueInfo.save({ session })

		// Commit the transaction
		await session.commitTransaction()
		session.endSession()

		// Respond to the client with success message and data
		res.status(200).json({
			message: 'Successfully joined the league',
			leagueId,
			userLeagueInfo,
		})
	} catch (error) {
		// Abort the transaction in case of error
		await session.abortTransaction()
		session.endSession()

		// Log the error for debugging purposes
		console.error('Error joining the league:', error)

		// Send internal server error response
		res.status(500).json({ message: 'Internal server error' })
	}
}

// Controller to handle leaving a league
export const leaveLeague = async (req, res) => {
	try {
		// Assuming the user ID is available from the authentication middleware
		const userId = req.user.id
		const { leagueId } = req.body

		// Check if the league exists
		const league = await League.findById(leagueId)
		if (!league) {
			return res.status(404).json({ message: 'League not found' })
		}

		// Check if the user is in the league
		if (!league.users.includes(userId)) {
			return res
				.status(400)
				.json({ message: 'User is not a member of this league' })
		}

		// Remove user from the league's users array
		await League.findByIdAndUpdate(leagueId, {
			$pull: { users: userId },
		})

		// Remove league from the user's leagues array
		await User.findByIdAndUpdate(userId, {
			$pull: { leagues: leagueId },
		})

		// Respond to the client
		res.status(200).json({ message: 'Successfully left the league', leagueId })
	} catch (error) {
		console.error('Error leaving the league:', error)
		res.status(500).json({ message: 'Internal server error' })
	}
}

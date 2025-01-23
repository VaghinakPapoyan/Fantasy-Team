// Import External Dependencies
import Badge from '../models/Badge.js' // Import the Badge model
import mongoose from 'mongoose' // Import mongoose for ObjectId validation
import User from '../models/User.js'
import Prize from '../models/Prize.js' // Import the Prize model
import Booster from '../models/Booster.js' // Import the Prize model
import League from '../models/League.js' // Import the Prize model
import UserLeague from '../models/UserLeague.js' // Adjust the path as needed
import FootballPlayer from '../models/FootballPlayer.js'

// Controller function to create a new badged
export const createBadge = async (req, res) => {
	try {
		// Extract badge data from the request body
		const badgeData = req.body

		// Validate required fields (name and condition)
		if (!badgeData.name || !badgeData.condition) {
			return res
				.status(400)
				.json({ message: 'Name and condition are required' })
		}

		// Check if a badge with the same name already exists
		const existingBadge = await Badge.findOne({ name: badgeData.name })
		if (existingBadge) {
			return res
				.status(400)
				.json({ message: 'Badge with this name already exists' })
		}

		// Validate leagues if provided
		if (badgeData.leagues && badgeData.leagues.length > 0) {
			const areValidLeagues = badgeData.leagues.every(leagueId =>
				mongoose.Types.ObjectId.isValid(leagueId)
			)
			if (!areValidLeagues) {
				return res
					.status(400)
					.json({ message: 'One or more invalid league IDs' })
			}
		}

		// Create a new badge instance with the provided data
		const badge = new Badge(badgeData)

		// Save the new badge to the database
		await badge.save()

		// Add the badge to all relevant users if user IDs are provided
		if (badgeData.users && badgeData.users.length > 0) {
			await User.updateMany(
				{ _id: { $in: badgeData.users } },
				{ $push: { badges: badge } }
			)
		}

		// Send a success response with the created badge
		res.status(201).json({
			message: 'Badge created successfully',
			badge,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Controller function to update an existing badge
export const updateBadge = async (req, res) => {
	try {
		const badgeId = req.params.id

		// Validate that the badge ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(badgeId)) {
			return res.status(400).json({ message: 'Invalid badge ID' })
		}

		const updateData = req.body

		// If the name is being updated, check for uniqueness
		if (updateData.name) {
			const existingBadge = await Badge.findOne({
				name: updateData.name,
				_id: { $ne: badgeId },
			})
			if (existingBadge) {
				return res
					.status(400)
					.json({ message: 'Badge with this name already exists' })
			}
		}

		// Validate leagues if provided
		if (updateData.leagues && updateData.leagues.length > 0) {
			const areValidLeagues = updateData.leagues.every(leagueId =>
				mongoose.Types.ObjectId.isValid(leagueId)
			)
			if (!areValidLeagues) {
				return res
					.status(400)
					.json({ message: 'One or more invalid league IDs' })
			}
		}

		// Find the badge by ID
		const existingBadge = await Badge.findById(badgeId)
		if (!existingBadge) {
			return res.status(404).json({ message: 'Badge not found' })
		}

		// Get the list of users currently holding this badge
		const oldUserIds = existingBadge.users.map(userId => userId.toString())

		// Get the list of users in the update request
		const newUserIds = updateData.users
			? updateData.users.map(userId => userId.toString())
			: []

		// Find users that need the badge removed (in oldUserIds but not in newUserIds)
		const usersToRemoveBadge = oldUserIds.filter(
			userId => !newUserIds.includes(userId)
		)

		// Find users that need the badge added (in newUserIds but not in oldUserIds)
		const usersToAddBadge = newUserIds.filter(
			userId => !oldUserIds.includes(userId)
		)

		// Remove the badge from users that no longer should have it
		if (usersToRemoveBadge.length > 0) {
			await User.updateMany(
				{ _id: { $in: usersToRemoveBadge } },
				{ $pull: { badges: badgeId } } // Use $pull to remove the badge
			)
		}

		// Add the badge to new users that need it
		if (usersToAddBadge.length > 0) {
			await User.updateMany(
				{ _id: { $in: usersToAddBadge } },
				{ $addToSet: { badges: badgeId } } // Use $addToSet to avoid duplicate entries
			)
		}

		// Update the badge with new data
		const updatedBadge = await Badge.findByIdAndUpdate(badgeId, updateData, {
			new: true,
		})

		// Send a success response with the updated badge
		res.status(200).json({
			message: 'Badge updated successfully',
			badge: updatedBadge,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Controller function to delete a badge
export const deleteBadge = async (req, res) => {
	try {
		const badgeId = req.params.id

		// Validate that the badge ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(badgeId)) {
			return res.status(400).json({ message: 'Invalid badge ID' })
		}

		// Find the badge by ID and delete it
		const badge = await Badge.findByIdAndDelete(badgeId)

		// If badge not found, send a 404 Not Found response
		if (!badge) {
			return res.status(404).json({ message: 'Badge not found' })
		}

		// Remove the badge ID from all users' badges arrays
		await User.updateMany(
			{ 'badges._id': badgeId },
			{ $pull: { badges: { _id: badgeId } } }
		)

		// Send a success response indicating the badge was deleted
		res.status(200).json({ message: 'Badge deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Controller function to get all badges
export const getAllBadges = async (req, res) => {
	try {
		// Extract query parameters for pagination and search
		const pageSize = Number(req.query.pageSize) || 10 // Number of badges per page (default to 10)
		const page = Number(req.query.pageNumber) || 1 // Current page number (default to 1)

		// Construct keyword search criteria
		const keyword = req.query.keyword
			? {
					$or: [
						{ name: { $regex: req.query.keyword, $options: 'i' } }, // Case-insensitive search on name
						{ description: { $regex: req.query.keyword, $options: 'i' } }, // Case-insensitive search on description
						{ tags: { $regex: req.query.keyword, $options: 'i' } }, // Case-insensitive search on tags
					],
			  }
			: {}

		// Get total count of badges matching the search criteria
		const count = await Badge.countDocuments({ ...keyword })

		// Fetch badges from the database with pagination and keyword filter
		const badges = await Badge.find({ ...keyword })
			.limit(pageSize) // Limit the number of badges per page
			.skip(pageSize * (page - 1)) // Skip badges for previous pages
			.sort({ dateCreated: -1 }) // Sort badges by creation date (newest first)

		// Send response with badges data and pagination info
		res.status(200).json({
			success: true, // Indicate successful response
			badges, // Array of badge objects
			page, // Current page number
			pages: Math.ceil(count / pageSize), // Total number of pages
			totalBadges: count, // Total number of badges matching the criteria
		})
	} catch (error) {
		// Log error to console for debugging
		console.error(error)
		// Send a 500 Internal Server Error response with error message
		res.status(500).json({ success: false, message: 'Server Error' })
	}
}

// Controller function to get a badge by ID
export const getBadgeById = async (req, res) => {
	try {
		// Extract the badge ID from the request parameters
		const badgeId = req.params.badgeId

		// Validate that the badge ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(badgeId)) {
			// If not valid, send a 400 Bad Request response
			return res.status(400).json({ message: 'Invalid badge ID' })
		}

		// Find the badge by ID
		const badge = await Badge.findById(badgeId)

		// If badge not found, send a 404 Not Found response
		if (!badge) {
			return res.status(404).json({ message: 'Badge not found' })
		}

		// Send a success response with the badge details
		res.status(200).json({
			message: 'Badge retrieved successfully', // Success message
			badge, // The badge object
		})
	} catch (error) {
		// If an error occurs, send a 500 Internal Server Error response
		res.status(500).json({ message: error.message }) // Error message
	}
}

// Controller function to create a new prize
export const createPrize = async (req, res) => {
	try {
		// Extract prize data from the request body
		const prizeData = req.body

		// Validate required fields (title, reward, and rankRange)
		if (!prizeData.title || !prizeData.reward || !prizeData.rankRange) {
			return res
				.status(400)
				.json({ message: 'Title, reward, and rankRange are required' })
		}

		// Validate rankRange object
		if (
			typeof prizeData.rankRange !== 'object' ||
			prizeData.rankRange.from === undefined ||
			prizeData.rankRange.to === undefined
		) {
			return res.status(400).json({ message: 'Invalid rankRange format' })
		}

		// Ensure rankRange.from <= rankRange.to
		if (prizeData.rankRange.from > prizeData.rankRange.to) {
			return res.status(400).json({
				message: 'rankRange.from must be less than or equal to rankRange.to',
			})
		}

		// Check if a prize with the same title already exists
		const existingPrize = await Prize.findOne({ title: prizeData.title })
		if (existingPrize) {
			return res
				.status(400)
				.json({ message: 'Prize with this title already exists' })
		}

		// Validate leagues if provided
		if (prizeData.leagues && prizeData.leagues.length > 0) {
			const areValidLeagues = prizeData.leagues.every(leagueId =>
				mongoose.Types.ObjectId.isValid(leagueId)
			)
			if (!areValidLeagues) {
				return res
					.status(400)
					.json({ message: 'One or more invalid league IDs' })
			}
		}

		// Validate users if provided
		if (prizeData.players && prizeData.players.length > 0) {
			const areValidUsers = prizeData.players.every(userId =>
				mongoose.Types.ObjectId.isValid(userId)
			)
			if (!areValidUsers) {
				return res.status(400).json({ message: 'One or more invalid user IDs' })
			}
		}

		// Create a new prize instance with the provided data
		const prize = new Prize(prizeData)

		// Save the new prize to the database
		await prize.save()

		// Add the prize to all relevant users if user IDs are provided
		if (prizeData.players && prizeData.players.length > 0) {
			await User.updateMany(
				{ _id: { $in: prizeData.players } },
				{ $addToSet: { prizes: prize._id } }
			)
		}

		// Add the prize to all relevant leagues if league IDs are provided
		if (prizeData.leagues && prizeData.leagues.length > 0) {
			await League.updateMany(
				{ _id: { $in: prizeData.leagues } },
				{ $addToSet: { prizes: prize._id } }
			)
		}

		// Send a success response with the created prize
		res.status(201).json({
			message: 'Prize created successfully',
			prize,
		})
	} catch (error) {
		// Send a 500 Internal Server Error response with error message
		res.status(500).json({ message: error.message })
	}
}

// Controller function to update an existing prize
export const updatePrize = async (req, res) => {
	try {
		const prizeId = req.params.id

		// Validate that the prize ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(prizeId)) {
			return res.status(400).json({ message: 'Invalid prize ID' })
		}

		const updateData = req.body

		// If the title is being updated, check for uniqueness
		if (updateData.title) {
			const existingPrize = await Prize.findOne({
				title: updateData.title,
				_id: { $ne: prizeId },
			})
			if (existingPrize) {
				return res
					.status(400)
					.json({ message: 'Prize with this title already exists' })
			}
		}

		// Validate rankRange if provided
		if (updateData.rankRange) {
			if (
				typeof updateData.rankRange !== 'object' ||
				updateData.rankRange.from === undefined ||
				updateData.rankRange.to === undefined
			) {
				return res.status(400).json({ message: 'Invalid rankRange format' })
			}
			if (updateData.rankRange.from > updateData.rankRange.to) {
				return res.status(400).json({
					message: 'rankRange.from must be less than or equal to rankRange.to',
				})
			}
		}

		// Validate leagues if provided
		if (updateData.leagues && updateData.leagues.length > 0) {
			const areValidLeagues = updateData.leagues.every(leagueId =>
				mongoose.Types.ObjectId.isValid(leagueId)
			)
			if (!areValidLeagues) {
				return res
					.status(400)
					.json({ message: 'One or more invalid league IDs' })
			}
		}

		// Validate users if provided
		if (updateData.players && updateData.players.length > 0) {
			const areValidUsers = updateData.players.every(userId =>
				mongoose.Types.ObjectId.isValid(userId)
			)
			if (!areValidUsers) {
				return res.status(400).json({ message: 'One or more invalid user IDs' })
			}
		}

		// Find the prize by ID
		const existingPrize = await Prize.findById(prizeId)
		if (!existingPrize) {
			return res.status(404).json({ message: 'Prize not found' })
		}

		// Update Users
		// Get the list of users currently associated with this prize
		const oldUserIds = existingPrize.players.map(userId => userId.toString())

		// Get the list of users in the update request
		const newUserIds = updateData.players
			? updateData.players.map(userId => userId.toString())
			: []

		// Find users that need the prize removed (in oldUserIds but not in newUserIds)
		const usersToRemovePrize = oldUserIds.filter(
			userId => !newUserIds.includes(userId)
		)

		// Find users that need the prize added (in newUserIds but not in oldUserIds)
		const usersToAddPrize = newUserIds.filter(
			userId => !oldUserIds.includes(userId)
		)

		// Remove the prize from users that no longer should have it
		if (usersToRemovePrize.length > 0) {
			await User.updateMany(
				{ _id: { $in: usersToRemovePrize } },
				{ $pull: { prizes: prizeId } }
			)
		}

		// Add the prize to new users that need it
		if (usersToAddPrize.length > 0) {
			await User.updateMany(
				{ _id: { $in: usersToAddPrize } },
				{ $addToSet: { prizes: prizeId } }
			)
		}

		// Update Leagues
		// Get the list of leagues currently associated with this prize
		const oldLeagueIds = existingPrize.leagues.map(leagueId =>
			leagueId.toString()
		)

		// Get the list of leagues in the update request
		const newLeagueIds = updateData.leagues
			? updateData.leagues.map(leagueId => leagueId.toString())
			: []

		// Find leagues that need the prize removed
		const leaguesToRemovePrize = oldLeagueIds.filter(
			leagueId => !newLeagueIds.includes(leagueId)
		)

		// Find leagues that need the prize added
		const leaguesToAddPrize = newLeagueIds.filter(
			leagueId => !oldLeagueIds.includes(leagueId)
		)

		// Remove the prize from leagues that no longer should have it
		if (leaguesToRemovePrize.length > 0) {
			await League.updateMany(
				{ _id: { $in: leaguesToRemovePrize } },
				{ $pull: { prizes: prizeId } }
			)
		}

		// Add the prize to new leagues that need it
		if (leaguesToAddPrize.length > 0) {
			await League.updateMany(
				{ _id: { $in: leaguesToAddPrize } },
				{ $addToSet: { prizes: prizeId } }
			)
		}

		// Update the prize with new data
		const updatedPrize = await Prize.findByIdAndUpdate(prizeId, updateData, {
			new: true,
		})

		// Send a success response with the updated prize
		res.status(200).json({
			message: 'Prize updated successfully',
			prize: updatedPrize,
		})
	} catch (error) {
		// Send a 500 Internal Server Error response with error message
		res.status(500).json({ message: error.message })
	}
}

// Controller function to delete a prize
export const deletePrize = async (req, res) => {
	try {
		const prizeId = req.params.id

		// Validate that the prize ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(prizeId)) {
			return res.status(400).json({ message: 'Invalid prize ID' })
		}

		// Find the prize by ID and delete it
		const prize = await Prize.findByIdAndDelete(prizeId)

		// If prize not found, send a 404 Not Found response
		if (!prize) {
			return res.status(404).json({ message: 'Prize not found' })
		}

		// Remove the prize ID from all users' prizes arrays
		await User.updateMany({ prizes: prizeId }, { $pull: { prizes: prizeId } })

		// Remove the prize ID from all leagues' prizes arrays
		await League.updateMany({ prizes: prizeId }, { $pull: { prizes: prizeId } })

		// Send a success response indicating the prize was deleted
		res.status(200).json({ message: 'Prize deleted successfully' })
	} catch (error) {
		// Send a 500 Internal Server Error response with error message
		res.status(500).json({ message: error.message })
	}
}

// Controller function to get all prizes
export const getAllPrizes = async (req, res) => {
	try {
		// Extract query parameters for pagination and search
		const pageSize = Number(req.query.pageSize) || 10 // Number of prizes per page (default to 10)
		const page = Number(req.query.pageNumber) || 1 // Current page number (default to 1)

		// Construct keyword search criteria
		const keyword = req.query.keyword
			? {
					$or: [
						{ title: { $regex: req.query.keyword, $options: 'i' } }, // Case-insensitive search on title
						{ description: { $regex: req.query.keyword, $options: 'i' } }, // Case-insensitive search on description
						{ condition: { $regex: req.query.keyword, $options: 'i' } }, // Case-insensitive search on condition
					],
			  }
			: {}

		// Get total count of prizes matching the search criteria
		const count = await Prize.countDocuments({ ...keyword })

		// Fetch prizes from the database with pagination and keyword filter
		const prizes = await Prize.find({ ...keyword })
			.limit(pageSize) // Limit the number of prizes per page
			.skip(pageSize * (page - 1)) // Skip prizes for previous pages
			.sort({ createdAt: -1 }) // Sort prizes by creation date (newest first)

		// Send response with prizes data and pagination info
		res.status(200).json({
			success: true, // Indicate successful response
			prizes, // Array of prize objects
			page, // Current page number
			pages: Math.ceil(count / pageSize), // Total number of pages
			totalPrizes: count, // Total number of prizes matching the criteria
		})
	} catch (error) {
		// Log error to console for debugging
		console.error(error)
		// Send a 500 Internal Server Error response with error message
		res.status(500).json({ success: false, message: 'Server Error' })
	}
}

// Controller function to get a prize by ID
export const getPrizeById = async (req, res) => {
	try {
		// Extract the prize ID from the request parameters
		const prizeId = req.params.prizeId

		// Validate that the prize ID is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(prizeId)) {
			return res.status(400).json({ message: 'Invalid prize ID' })
		}

		// Find the prize by ID
		const prize = await Prize.findById(prizeId)

		// If prize not found, send a 404 Not Found response
		if (!prize) {
			return res.status(404).json({ message: 'Prize not found' })
		}

		// Send a success response with the prize details
		res.status(200).json({
			message: 'Prize retrieved successfully',
			prize,
		})
	} catch (error) {
		// Send a 500 Internal Server Error response with error message
		res.status(500).json({ message: error.message })
	}
}

export const createBooster = async (req, res) => {
	try {
		const boosterData = req.body

		// Validate required fields
		if (!boosterData.name) {
			return res.status(400).json({ message: 'Name is required' })
		}

		// Check if a booster with the same name already exists
		const existingBooster = await Booster.findOne({ name: boosterData.name })
		if (existingBooster) {
			return res
				.status(400)
				.json({ message: 'Booster with this name already exists' })
		}

		// Validate and process leagues
		let validatedLeagues = []

		if (boosterData.leagues && boosterData.leagues.length > 0) {
			// Validate league IDs
			const leagueIds = boosterData.leagues.filter(leagueId =>
				mongoose.Types.ObjectId.isValid(leagueId)
			)

			// Check if all provided league IDs exist
			validatedLeagues = await League.find({
				_id: { $in: leagueIds },
			})

			if (validatedLeagues.length !== leagueIds.length) {
				return res
					.status(400)
					.json({ message: 'One or more league IDs are invalid' })
			}
		}

		// Create a new booster instance
		const booster = new Booster({
			...boosterData,
			leagues: validatedLeagues.map(league => league._id),
		})

		// Save the new booster
		await booster.save()

		// Update associated leagues with the new booster
		if (validatedLeagues.length > 0) {
			await League.updateMany(
				{ _id: { $in: validatedLeagues.map(league => league._id) } },
				{ $addToSet: { boosters: booster._id } }
			)
		}

		res.status(201).json({
			message: 'Booster created successfully',
			booster,
		})
	} catch (error) {
		console.error('Error creating booster:', error)
		res.status(500).json({
			message: 'Failed to create booster',
			error: error.message,
		})
	}
}

export const updateBooster = async (req, res) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const boosterId = req.params.id

		// Validate the booster ID
		if (!mongoose.Types.ObjectId.isValid(boosterId)) {
			return res.status(400).json({ message: 'Invalid booster ID' })
		}

		const updateData = req.body

		// Find the existing booster
		const existingBooster = await Booster.findById(boosterId).session(session)
		if (!existingBooster) {
			return res.status(404).json({ message: 'Booster not found' })
		}

		// If the name is being updated, check for uniqueness
		if (updateData.name && updateData.name !== existingBooster.name) {
			const nameConflict = await Booster.findOne({
				name: updateData.name,
				_id: { $ne: boosterId },
			}).session(session)

			if (nameConflict) {
				return res
					.status(400)
					.json({ message: 'Booster with this name already exists' })
			}
		}

		// Validate and process leagues
		let validatedLeagues = []
		let existingLeagues = existingBooster.leagues || []

		if (updateData.leagues !== undefined) {
			// If leagues is an empty array or undefined, handle league deletion
			if (updateData.leagues.length === 0 || updateData.leagues === null) {
				// Remove this booster from all previously associated leagues
				await League.updateMany(
					{ boosters: boosterId },
					{ $pull: { boosters: boosterId } }
				).session(session)

				// Clear leagues from the booster
				existingBooster.leagues = []
			} else {
				// Validate league IDs
				const leagueIds = updateData.leagues.filter(leagueId =>
					mongoose.Types.ObjectId.isValid(leagueId)
				)

				// Check if all provided league IDs exist
				validatedLeagues = await League.find({
					_id: { $in: leagueIds },
				}).session(session)

				if (validatedLeagues.length !== leagueIds.length) {
					return res
						.status(400)
						.json({ message: 'One or more league IDs are invalid' })
				}

				// Remove booster from previously associated leagues
				await League.updateMany(
					{ boosters: boosterId },
					{ $pull: { boosters: boosterId } }
				).session(session)

				// Add booster to new leagues
				await League.updateMany(
					{ _id: { $in: validatedLeagues.map(league => league._id) } },
					{ $addToSet: { boosters: boosterId } }
				).session(session)

				// Update booster's leagues
				existingBooster.leagues = validatedLeagues.map(league => league._id)
			}
		}

		// Prepare and apply other update fields
		const updateFields = { ...updateData }
		delete updateFields.leagues

		// Update the booster with other fields
		const updatedBooster = await Booster.findByIdAndUpdate(
			boosterId,
			{ $set: updateFields },
			{ new: true, session }
		)

		// If leagues were specifically updated, save the booster to persist league changes
		if (updateData.leagues !== undefined) {
			await existingBooster.save({ session })
		}

		await session.commitTransaction()
		session.endSession()

		res.status(200).json({
			message: 'Booster updated successfully',
			booster: updatedBooster,
		})
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		console.error('Error updating booster:', error)
		res.status(500).json({
			message: 'Failed to update booster',
			error: error.message,
		})
	}
}

// Controller function to delete a booster
export const deleteBooster = async (req, res) => {
	try {
		const boosterId = req.params.id

		// Validate the booster ID
		if (!mongoose.Types.ObjectId.isValid(boosterId)) {
			return res.status(400).json({ message: 'Invalid booster ID' })
		}

		// Find and delete the booster
		const booster = await Booster.findByIdAndDelete(boosterId)

		if (!booster) {
			return res.status(404).json({ message: 'Booster not found' })
		}

		// Optionally, remove references to this booster from users or other entities

		res.status(200).json({ message: 'Booster deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// Controller function to get all boosters
export const getAllBoosters = async (req, res) => {
	try {
		const pageSize = Number(req.query.pageSize) || 10
		const page = Number(req.query.pageNumber) || 1

		const keyword = req.query.keyword
			? {
					$or: [
						{ name: { $regex: req.query.keyword, $options: 'i' } },
						{ description: { $regex: req.query.keyword, $options: 'i' } },
						{ tags: { $regex: req.query.keyword, $options: 'i' } },
					],
			  }
			: {}

		const count = await Booster.countDocuments({ ...keyword })

		const boosters = await Booster.find({ ...keyword })
			.limit(pageSize)
			.skip(pageSize * (page - 1))
			.sort({ createdAt: -1 })

		res.status(200).json({
			success: true,
			boosters,
			page,
			pages: Math.ceil(count / pageSize),
			totalBoosters: count,
		})
	} catch (error) {
		res.status(500).json({ success: false, message: 'Server Error' })
	}
}

// Controller function to get a booster by ID
export const getBoosterById = async (req, res) => {
	try {
		const { boosterId } = req.params

		// Validate the booster ID
		if (!mongoose.Types.ObjectId.isValid(boosterId)) {
			return res.status(400).json({ message: 'Invalid booster ID' })
		}

		// Find the booster by ID
		const booster = await Booster.findById(boosterId)

		if (!booster) {
			return res.status(404).json({ message: 'Booster not found' })
		}

		res.status(200).json({
			message: 'Booster retrieved successfully',
			booster,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const getUserLeague = async (req, res) => {
	try {
		// Get userId and leagueId from request parameters or body
		const userId = req.params.userId || req.body.userId || req.user.id
		const leagueId = req.params.leagueId || req.body.leagueId

		// Validate that both userId and leagueId are provided
		if (!userId || !leagueId) {
			return res
				.status(400)
				.json({ message: 'User ID and League ID are required' })
		}

		// Find the UserLeague document
		const UserLeagueInfo = await UserLeague.findOne({ userId, leagueId })
			.populate('userId', 'username email') // Populate user fields as needed
			.populate('leagueId', 'name description') // Populate league fields as needed
		// .populate('team.players', 'name position team') // Populate player info
		// .populate('team.captain', 'name position team') // Populate captain info
		// .populate('team.viceCaptain', 'name position team') // Populate vice-captain info
		// .populate('boosters.boosterId', 'name effect') // Populate booster info
		// .populate('transfersMade', 'fromPlayer toPlayer transferDate') // Populate transfers
		// .populate('gameWeeks.highestScoringPlayer', 'name position points') // Populate highest scoring player
		// .populate('gameWeeks.lowestScoringPlayer', 'name position points') // Populate lowest scoring player
		// .populate('gameWeeks.boostersUsed.boosterId', 'name effect') // Populate gameweek boosters used
		// .populate('gameWeeks.headToHead.matchups.opponentId', 'userId leagueId') // Populate opponent info
		// .exec()

		// If not found, return 404
		if (!UserLeagueInfo) {
			return res.status(404).json({ message: 'UserLeague not found' })
		}

		// Return the UserLeagueInfo data
		res.status(200).json({ UserLeague: UserLeagueInfo })
	} catch (error) {
		// Log the error for debugging purposes
		console.error('Error retrieving UserLeague:', error)

		// Send internal server error response
		res.status(500).json({ message: 'Internal server error' })
	}
}

export const updateUserLeague = async (req, res) => {
	try {
		// Extract userId and leagueId from request parameters or body
		const userId = req.params.userId || req.body.userId || req.user.id
		const leagueId = req.params.leagueId || req.body.leagueId

		// Check if both userId and leagueId are provided
		if (!userId || !leagueId) {
			return res
				.status(400)
				.json({ message: 'userId and leagueId are required.' })
		}

		// Extract update data from request body
		const updateData = { ...req.body }

		// Remove sensitive or immutable fields
		const protectedFields = ['userId', 'leagueId', 'userName', 'leagueName']
		protectedFields.forEach(field => delete updateData[field])

		// Find the user league document
		const userLeague = await UserLeague.findOne({ userId, leagueId })
		if (!userLeague) {
			return res.status(404).json({
				message: 'League info not found for the given user and league.',
			})
		}

		// Preprocess gameWeeks to handle ObjectId conversions and validations
		if (updateData.gameWeeks) {
			// Find the maximum gameweek index being updated
			const maxGameweekIndex = updateData.gameWeeks.reduce(
				(max, gameWeek) =>
					Math.max(
						max,
						gameWeek?.gameweekNumber ? gameWeek?.gameweekNumber - 1 : -1
					),
				-1
			)

			// Ensure the gameWeeks array is expanded to the correct length with null entries
			const expandedGameWeeks = Array(maxGameweekIndex + 1)
				.fill(null)
				.map((_, index) => {
					// If this index is being updated, use the update data
					const updateForThisIndex = updateData.gameWeeks.find(
						gw => gw?.gameweekNumber === index + 1
					)

					if (updateForThisIndex) {
						return {
							...updateForThisIndex,
							// Filter and validate boostersUsed
							boostersUsed: updateForThisIndex.boostersUsed
								? updateForThisIndex.boostersUsed
										.filter(
											booster =>
												booster && mongoose.Types.ObjectId.isValid(booster)
										)
										.map(booster => new mongoose.Types.ObjectId(booster))
								: [],
						}
					}

					// If no update for this index, return null
					return null
				})

			// Update the gameWeeks in the updateData
			updateData.gameWeeks = expandedGameWeeks
		}

		// Perform deep update on the userLeague document
		const deepUpdate = (target, source) => {
			Object.keys(source).forEach(key => {
				if (source[key] !== undefined) {
					if (Array.isArray(source[key])) {
						// For gameWeeks, merge with existing array
						if (key === 'gameWeeks') {
							// Merge the new gameWeeks with existing ones
							target[key] = source[key].map((newGw, index) =>
								newGw !== null
									? newGw
									: (target[key] && target[key][index]) || null
							)
						} else {
							// For other arrays, completely replace
							target[key] = source[key]
						}
					} else if (typeof source[key] === 'object' && source[key] !== null) {
						// For nested objects, recursively update
						if (!target[key]) target[key] = {}
						deepUpdate(target[key], source[key])
					} else {
						// For primitive values, directly assign
						target[key] = source[key]
					}
				}
			})
		}

		// Perform deep update on the userLeague document
		deepUpdate(userLeague, updateData)

		// Save the updated document
		await userLeague.save()

		// Send a success response
		res.status(200).json({
			message: 'User league info updated successfully.',
			data: userLeague,
		})
	} catch (error) {
		// Handle errors and send an appropriate response
		console.error('Error updating user league info:', error)
		res.status(500).json({
			message: 'An error occurred while updating user league info.',
			error: error.message,
		})
	}
}

// Create Team for a Gameweek
export const createTeamForGameweek = async (req, res) => {
	try {
		const {
			userId,
			leagueId,
			gameweekNumber,
			players,
			captain,
			viceCaptain,
			budget,
		} = req.body

		// Validate Input
		if (
			!userId ||
			!leagueId ||
			!gameweekNumber ||
			!players ||
			players.length === 0
		) {
			return res
				.status(400)
				.json({ message: 'Invalid input. Please provide all required fields.' })
		}

		if (players.length !== 11) {
			return res
				.status(400)
				.json({ message: 'A team must consist of exactly 11 players.' })
		}

		// Fetch Players from the Database
		const selectedPlayers = await FootballPlayer.find({ _id: { $in: players } })

		if (selectedPlayers.length !== players.length) {
			return res.status(404).json({ message: 'One or more players not found.' })
		}

		// Calculate Total Cost of the Selected Players
		const totalCost = selectedPlayers.reduce(
			(sum, player) => sum + player.price,
			0
		)
		if (totalCost > budget) {
			return res
				.status(400)
				.json({ message: 'Team exceeds the allowed budget.' })
		}

		// Validate Captain and Vice-Captain
		if (!players.includes(captain) || !players.includes(viceCaptain)) {
			return res.status(400).json({
				message:
					'Captain and Vice-Captain must be part of the selected players.',
			})
		}

		// Find or Create UserLeagueInfo
		let userLeagueInfo = await UserLeague.findOne({ userId, leagueId })
		if (!userLeagueInfo) {
			userLeagueInfo = new UserLeague({
				userId,
				leagueId,
			})
		}

		// Check if Gameweek Already Exists
		const existingGameweek = userLeagueInfo.gameWeeks.find(
			gw => gw.gameweekNumber === gameweekNumber
		)
		if (existingGameweek) {
			return res.status(400).json({
				message: `Team for gameweek ${gameweekNumber} already exists.`,
			})
		}

		// Add the Team for the Gameweek
		userLeagueInfo.gameWeeks.push({
			gameweekNumber,
			team: {
				players,
				captain,
				viceCaptain,
				transferBudget: budget - totalCost,
			},
		})

		// Save the UserLeagueInfo Document
		await userLeagueInfo.save()

		res.status(201).json({
			message: 'Team created successfully for the gameweek.',
			userLeagueInfo,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error. Please try again later.' })
	}
}

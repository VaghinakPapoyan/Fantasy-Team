// Import External Dependencies
import mongoose from 'mongoose'

// Define the League schema
const leagueSchema = new mongoose.Schema({
	leagueName: {
		type: String,
		required: true,
		// The name of the league
	},
	leagueId: {
		type: String,
		required: true,
		unique: true,
		index: true,
		// A unique identifier for the league
	},
	leagueType: {
		type: String,
		enum: ['public', 'private', 'H2H'],
		required: true,
		// The type of the league, determining how it operates
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'completed'],
		default: 'active',
		// The current status of the league
		// 'active' - ongoing, 'inactive' - not started, 'completed' - finished
	},
	country: {
		name: {
			type: String,
			// The name of the country the league is based in
		},
		code: {
			type: String,
			// The country code (e.g., 'US', 'GB')
		},
	},
	season: {
		type: String,
		required: true,
		// The season for which the league is applicable (e.g., '2023-2024')
	},
	transferLimit: {
		type: Number,
		default: 0,
		// The maximum number of transfers allowed per game week
	},
	startDate: {
		type: Date,
		required: true,
		// The date when the league starts
	},
	endDate: {
		type: Date,
		required: true,
		// The date when the league ends
	},
	timezone: {
		type: String,
		default: 'UTC',
		// The timezone in which the league operates
	},
	gameWeeks: [
		{
			fixturesStandings: {
				type: mongoose.Schema.Types.Mixed,
				// Details of fixtures and standings for the game week
			},
			startDate: {
				type: Date,
				// Start date of the game week
			},
			endDate: {
				type: Date,
				// End date of the game week
			},
		},
	],
	description: {
		type: String,
		// A detailed description of the league
	},
	price: {
		type: Number,
		required: true,
		// Entry fee for the league
	},
	entryDeadline: {
		type: Date,
		required: true,
		// The deadline for joining the league
	},
	apiProvider: {
		name: {
			type: String,
			// Name of the API provider for league data
		},
		baseUrl: {
			type: String,
			// Base URL of the API provider
		},
		apiKey: {
			type: String,
			// API key for accessing the provider's data
		},
	},
	lastSyncTime: {
		type: Date,
		// The last time data was synced from the API provider
	},
	syncFrequency: {
		type: Number,
		// How often the data should be synced, in minutes
	},
	players: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'FootballPlayer',
			// Users participating in the league
		},
	],
	clubs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Club',
			// Clubs involved in the league
		},
	],
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			// Football players available in the league
		},
	],
	winners: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			// Users who have won the league
		},
	],
	prizes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'League',
			// Prizes connected with league
		},
	],
	imageLink: {
		type: String,
		// URL to the league's image or logo
	},
	// h2hLeagues: [
	// 	{
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: 'League',
	// 		// Head-to-head leagues associated with this league
	// 	},
	// ],
	boosters: [
		{
			type: String,
			// Boosters or power-ups available in the league
		},
	],
	closed: {
		type: Boolean,
		default: false,
		// Indicates whether the league is closed for new entries
	},
})

// Virtual Properties
// Virtual property to get the total number of players in the league
leagueSchema.virtual('totalPlayers').get(function () {
	return this.players.length
})

// Virtual property to check if the league is currently active
leagueSchema.virtual('isActive').get(function () {
	const now = new Date()
	return now >= this.startDate && now <= this.endDate
})

// Virtual property to calculate the duration of the league in days
leagueSchema.virtual('duration').get(function () {
	const durationInMs = this.endDate - this.startDate
	return Math.floor(durationInMs / (1000 * 60 * 60 * 24))
})

// Middlewares

// Middleware to sort gameWeeks by startDate before saving
leagueSchema.pre('save', function (next) {
	if (this.gameWeeks && this.gameWeeks.length > 0) {
		this.gameWeeks.sort((a, b) => a.startDate - b.startDate)
	}
	next()
})

// Methods
// Method to add a player to the league
leagueSchema.methods.addPlayer = function (playerId) {
	if (!this.players.includes(playerId)) {
		this.players.push(playerId)
		return this.save()
	}
}
// Method to remove a player from the league
leagueSchema.methods.removePlayer = function (playerId) {
	this.players = this.players.filter(
		id => id.toString() !== playerId.toString()
	)
	return this.save()
}
// Method to sync data from the API provider
leagueSchema.methods.syncData = async function () {
	// Implementation to fetch data from apiProvider and update the league
	// Update lastSyncTime after syncing
	this.lastSyncTime = new Date()
	return this.save()
}

// Exporting the model to be used in the application
const League = mongoose.models.League || mongoose.model('League', leagueSchema)
export default League

// Import External Dependencies
import mongoose from 'mongoose'

// Define the UserLeagueInfo Schema
const userLeagueInfoSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		// Reference to the User model
	},
	leagueId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'League',
		required: true,
		// Reference to the League model
	},

	teamName: {
		type: String,
		required: true,
		// Name of the user's team
	},

	currentPoints: {
		type: Number,
		default: 0,
		// Current total points for the user in the league
	},

	currentRank: {
		type: Number,
		default: null,
		// User's current rank in the league
	},

	activity: {
		type: Number,
		default: 0,
		// The number of actions the user has performed in the league
	},

	isActive: {
		type: Boolean,
		default: true,
		// Whether the user is currently active in the league
	},
	joinedAt: {
		type: Date,
		default: Date.now,
		// The date and time when the user joined the league
	},
	lastUpdated: {
		type: Date,
		default: Date.now,
		// Timestamp of the last update to this document
	},

	lastActiveAt: {
		type: Date,
		default: Date.now, // Defaults to the current date and time
		// Tracks the timestamp of the user's last activity in the league
	},

	teamLogo: {
		type: String,
		// URL or path to the team's logo image
	},

	headToHeadStats: {
		winRate: {
			type: Number,
			default: 0, // Win rate in head-to-head matches
		},
		streaks: {
			currentStreak: {
				type: Number,
				default: 0, // Current streak of wins, losses, or draws
			},
			bestStreak: {
				type: Number,
				default: 0, // Best streak achieved
			},
		},
	},

	notifications: [
		{
			message: {
				type: String,
				// Notification message
			},
			isRead: {
				type: Boolean,
				default: false,
				// Whether the notification has been read
			},
			createdAt: {
				type: Date,
				default: Date.now,
				// Timestamp of when the notification was created
			},
		},
	],
	gameWeeks: [
		{
			gameweekNumber: {
				type: Number,
				// The game-week number
			},

			pointsScored: {
				type: Number,
				default: 0,
				// Points scored in this game-week
			},

			gameweekRank: {
				type: Number,
				default: null,
				// Rank of the user in this gameweek
			},

			scoreMultiplier: {
				type: Number,
				default: 1,
				// Multiplier applied to the user's score in the league
			},

			benchPoints: {
				type: Number,
				default: 0,
				// Points scored by bench players
			},
			transfersMade: [
				{
					type: Number,
					default: 0,
					// History of transfers made by the user (references to Transfer model)
				},
			],

			transfersMadeCount: {
				type: Number,
				default: 0,
				// Transfers made in this gameweek
			},
			boostersUsed: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Booster',
					// Add this to allow null or empty values
					default: null,
				},
			],
			headToHead: {
				opponentId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'UserLeagueInfo',
					// Reference to opponent's league information
				},
				opponentPoints: {
					type: Number,
					default: 0,
					// Points scored by the opponent
				},
				result: {
					type: String,
					enum: ['Win', 'Loss', 'Draw'],
					default: null,
					// Result of the head-to-head match
				},
				pointsDifference: {
					type: Number,
					// Difference in points scored between the user and the opponent
				},
			},

			team: {
				players: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'FootballPlayer',
						// Array of players in the user's team (references to Player model)
					},
				],
				transferHistory: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Transfer',
						// History of transfers within the team (references to Transfer model)
					},
				],
				captain: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'FootballPlayer',
					// Player ID of the team captain
				},
				viceCaptain: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'FootballPlayer',
					// Player ID of the team vice-captain
				},
				benchPlayers: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'FootballPlayer',
						// Array of bench players in the user's team
					},
				],
				transferBudget: {
					type: Number,
					default: 100,
					// Transfer budget for the user to manage the team
				},
			},
		},
	],
})

userLeagueInfoSchema.virtual('totalBoostersUsed').get(function () {
	return this.allBoosters.filter(booster => booster.used).length
})

// Middlewares
userLeagueInfoSchema.pre('save', function (next) {
	this.lastUpdated = Date.now()
	next()
})

// Methods
userLeagueInfoSchema.methods.incrementActivity = function () {
	this.activity += 1
	return this.save()
}
userLeagueInfoSchema.methods.addNotification = function (message) {
	this.notifications.push({ message })
	return this.save()
}

// Exporting the model to be used in the application
const UserLeagueInfo =
	mongoose.models.UserLeagueInfo ||
	mongoose.model('UserLeagueInfo', userLeagueInfoSchema)

export default UserLeagueInfo

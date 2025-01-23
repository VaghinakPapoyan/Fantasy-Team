// Import External Dependencies
import mongoose from 'mongoose'

// Define the Club schema
const clubSchema = new mongoose.Schema({
	clubName: {
		type: String,
		required: true,
		// The official name of the club
	},
	clubId: {
		type: Number,
		required: true,
		unique: true,
		index: true,
		// A unique identifier for the club from the API
	},
	shortName: {
		type: String,
		// Shortened name of the club
	},
	tla: {
		type: String,
		// Three-letter abbreviation of the club's name
	},
	crestUrl: {
		type: String,
		// URL to the club's crest image
	},
	address: {
		type: String,
		// Club's address
	},
	phone: {
		type: String,
		// Contact phone number of the club
	},
	website: {
		type: String,
		// Official website of the club
	},
	email: {
		type: String,
		// Contact email of the club
	},
	founded: {
		type: Number,
		// Year the club was founded
	},
	clubColors: {
		type: String,
		// Official colors of the club
	},
	venue: {
		type: String,
		// Name of the club's home stadium or venue
	},
	players: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'FootballPlayer',
			// References to players belonging to the club
		},
	],
	lastUpdated: {
		type: Date,
		// Timestamp of the last update from the API
	},
})

// Virtual Properties

// Virtual property to get the total number of players in the club
clubSchema.virtual('totalPlayers').get(function () {
	return this.players.length
})

// Virtual property to get the age of the club
clubSchema.virtual('age').get(function () {
	const currentYear = new Date().getFullYear()
	return this.founded ? currentYear - this.founded : null
})

// Middlewares

// Middleware to populate players before find queries
// clubSchema.pre('find', function (next) {
// 	this.populate('players')
// 	next()
// })

// Methods

// Method to add a player to the club
clubSchema.methods.addPlayer = function (playerId) {
	if (!this.players.includes(playerId)) {
		this.players.push(playerId)
		return this.save()
	}
}

// Method to remove a player from the club
clubSchema.methods.removePlayer = function (playerId) {
	this.players = this.players.filter(
		id => id.toString() !== playerId.toString()
	)
	return this.save()
}

// Exporting the model to be used in the application
const Club = mongoose.models.Club || mongoose.model('Club', clubSchema)
export default Club

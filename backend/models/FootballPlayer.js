// Import External Dependencies
import mongoose from 'mongoose'

// Define the FootballPlayer schema
const footballPlayerSchema = new mongoose.Schema({
	playerName: {
		type: String,
		required: true,
		// Full name of the player
	},
	playerId: {
		type: Number,
		required: true,
		unique: true,
		index: true,
		// Unique identifier for the player from the API
	},
	position: {
		type: String,
		// Player's position on the field
	},
	dateOfBirth: {
		type: Date,
		// Date of birth of the player
	},
	countryOfBirth: {
		type: String,
		// Country where the player was born
	},
	nationality: {
		type: String,
		// Nationality of the player
	},
	shirtNumber: {
		type: Number,
		// Player's shirt number
	},
	role: {
		type: String,
		// Player's role in the team (e.g., 'PLAYER', 'COACH')
	},
	team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Club',
		// Reference to the club the player belongs to
	},
	lastUpdated: {
		type: Date,
		// Timestamp of the last update from the API
	},
})

// Virtual Properties

// Virtual property to calculate the player's age
footballPlayerSchema.virtual('age').get(function () {
	if (this.dateOfBirth) {
		const ageDifMs = Date.now() - this.dateOfBirth.getTime()
		const ageDate = new Date(ageDifMs) // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}
	return null
})

// Middlewares

// Middleware to populate team before find queries
// footballPlayerSchema.pre('find', function (next) {
// 	this.populate('team')
// 	next()
// })

// Methods

// Method to update player's club
footballPlayerSchema.methods.updateClub = function (clubId) {
	this.team = clubId
	return this.save()
}

// Exporting the model to be used in the application
const FootballPlayer =
	mongoose.models.FootballPlayer ||
	mongoose.model('FootballPlayer', footballPlayerSchema)
export default FootballPlayer

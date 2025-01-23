// Import External Dependencies
import mongoose from 'mongoose'

// Define the Prize Schema
const prizeSchema = new mongoose.Schema(
	{
		leagues: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'League',
				// Array of leagues associated with this prize
			},
		],
		players: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Player',
				// Array of players who are eligible for this prize
			},
		],
		isDistributed: {
			type: Boolean,
			default: false,
			// Indicates whether the prize has been distributed
		},
		title: {
			type: String,
			required: true,
			trim: true,
			// Title of the prize
		},
		description: {
			type: String,
			trim: true,
			// Detailed description of the prize
		},
		condition: {
			type: String,
			// The condition or criteria to earn the prize (optional)
		},
		reward: {
			type: String,
			required: true,
			// Description of the reward
		},
		isActive: {
			type: Boolean,
			default: true,
			// Indicates whether the prize is currently active
		},
		imageUrl: {
			type: String,
			// URL to the image representing the prize
		},
		rankRange: {
			from: {
				type: Number,
				required: true,
				// Starting rank for eligibility
			},
			to: {
				type: Number,
				required: true,
				// Ending rank for eligibility
			},
			// Object representing the range of ranks that qualify for the prize
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
)

// Virtual Properties
// Virtual property to get the number of players associated with this prize
prizeSchema.virtual('playerCount').get(function () {
	return this.players.length
})

// Middlewares

// Pre-validate middleware to ensure rankRange.from is less than or equal to rankRange.to
prizeSchema.pre('validate', function (next) {
	if (this.rankRange && this.rankRange.from > this.rankRange.to) {
		next(new Error('rankRange.from must be less than or equal to rankRange.to'))
	} else {
		next()
	}
})

// Pre-save middleware to ensure imageUrl is valid or set default image
prizeSchema.pre('save', function (next) {
	if (!this.imageUrl) {
		this.imageUrl =
			'https://res.cloudinary.com/drk8cwew2/image/upload/v1733222389/outfbzujyiiqedwz1e8u.png' // Set your default image URL here
	}
	next()
})

// Methods

// Method to add a player to the prize's players array
prizeSchema.methods.addPlayer = function (playerId) {
	if (!this.players.includes(playerId)) {
		this.players.push(playerId)
		return this.save()
	}
	return Promise.resolve(this)
}

// Method to remove a player from the prize's players array
prizeSchema.methods.removePlayer = function (playerId) {
	this.players = this.players.filter(
		id => id.toString() !== playerId.toString()
	)
	return this.save()
}

// Exporting the Prize model to be used in the application
const Prize = mongoose.models.Prize || mongoose.model('Prize', prizeSchema)
export default Prize

// Import External Dependencies
import mongoose from 'mongoose'

// Define the Booster Schema
const boosterSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			// The unique name of the booster
		},
		description: {
			type: String,
			trim: true,
			// A detailed description of the booster
		},
		cost: {
			type: Number,
			required: true,
			min: 0,
			// The cost to activate the booster
		},
		leagues: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'League',
				// Array of leagues where this booster is applicable
			},
		],
		usedCount: {
			type: Number,
			default: 0,
			min: 0,
			// Number of times this booster has been used
		},
		duration: {
			type: Number,
			min: 0,
			// Number of times this booster has been used
		},
		usageLimit: {
			type: Number,
			min: 0,
			default: 0,
			// A map where the key is league ID and value is the usage limit for that league
		},
		iconUrl: {
			type: String,
			// URL to the icon representing the booster
		},
		isActive: {
			type: Boolean,
			default: true,
			// Indicates whether the booster is currently active
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
)

// Virtual Properties
// Virtual property to calculate total usage across all leagues
boosterSchema.virtual('totalUsage').get(function () {
	return this.usedCount
})

// Middleware
// Pre-save middleware to ensure iconUrl is valid or set default icon
boosterSchema.pre('save', function (next) {
	if (!this.iconUrl) {
		this.iconUrl = 'https://example.com/default_booster_icon.png' // Set your default icon URL here
	}
	next()
})

// Methods

// Method to increment usage count for a league
boosterSchema.methods.incrementUsage = function (leagueId) {
	if (
		!this.usageLimit.has(leagueId) ||
		this.usedCount >= this.usageLimit.get(leagueId)
	) {
		throw new Error(`Usage limit reached for league ${leagueId}`)
	}
	this.usedCount += 1
	return this.save()
}

// Method to reset usage count for a specific league
boosterSchema.methods.resetUsageForLeague = function (leagueId) {
	if (this.usageLimit.has(leagueId)) {
		this.usedCount = 0
	}
	return this.save()
}

// Method to toggle the active status of the booster
boosterSchema.methods.toggleActiveStatus = function () {
	this.isActive = !this.isActive
	return this.save()
}

// Exporting the Booster model to be used in the application
const Booster =
	mongoose.models.Booster || mongoose.model('Booster', boosterSchema)
export default Booster

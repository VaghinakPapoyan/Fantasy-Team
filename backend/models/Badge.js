// Import External Dependencies
import mongoose from 'mongoose'

// Define the Badge Schema
const badgeSchema = new mongoose.Schema({
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			// Array of user IDs who have earned this badge
		},
	],

	leagues: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'League',
			// Array of leagues associated with this badge
		},
	],
	name: {
		type: String,
		required: true,
		trim: true,
		// Name of the badge
	},
	description: {
		type: String,
		trim: true,
		// Detailed description of the badge and how to earn it
		// Trimmed to remove extra whitespace
	},
	iconUrl: {
		type: String,
		// URL to the icon image representing the badge
	},
	condition: {
		type: String,
		required: true,
		// The condition or criteria that must be met to earn the badge
		// Could be a description or code representing the condition
	},
	xpValue: {
		type: Number,
		default: 0,
		// Experience points awarded when the badge is earned
	},
	tags: [
		{
			type: String,
			// Tags for categorization or filtering of badges
		},
	],
	dateCreated: {
		type: Date,
		default: Date.now,
		// Timestamp when the badge was created
	},
})

// Virtual Properties
// Virtual property to get the number of users who have earned this badge
badgeSchema.virtual('userCount').get(function () {
	return this.users.length
})

// Middlewares
// Pre-save middleware to ensure iconUrl is valid or set default icon
badgeSchema.pre('save', function (next) {
	if (!this.iconUrl) {
		this.iconUrl =
			'https://res.cloudinary.com/dv7fcnkoa/image/upload/v1729323792/default_badge_wwh6yd.png'
	}
	next()
})

// Methods
// Method to add a user to the badge's users array
badgeSchema.methods.addUser = function (userId) {
	if (!this.users.includes(userId)) {
		this.users.push(userId)
		return this.save()
	}
	return Promise.resolve(this)
}

// Method to remove a user from the badge's users array
badgeSchema.methods.removeUser = function (userId) {
	this.users = this.users.filter(id => id.toString() !== userId.toString())
	return this.save()
}

// Exporting the Badge model to be used in the application
const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema)
export default Badge

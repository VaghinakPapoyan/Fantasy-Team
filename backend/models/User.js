// Import External Dependencies
import mongoose from 'mongoose'

// Import Internal Dependencies
import { hash, compare } from '../utils/hashing.js'

const userSchema = new mongoose.Schema({
	role: {
		type: String,
		enum: ['registered', 'premium', 'super-admin'],
		default: 'registered',
		// The role of the user in the system. Determines the level of access and privileges.
		// "registered" - signed-up, "premium" - bought a league, "super admin" - super admin.
	},
	firstName: {
		type: String,
		// First name of the user
	},
	lastName: {
		type: String,
		// Last name of the user
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
		lowercase: true,
		// The user's email address, used for login and communication.
		// Is required and must be unique for each user.
		// Email addresses are stored in lowercase to ensure case-insensitivity.
	},
	dateOfBirth: {
		type: Date,
		required: true,
		// The user's birth date, important for age verification or other age-related restrictions, which is required for registration.
	},
	dateOfRegistration: {
		type: Date,
		default: Date.now,
		// The date and time the user registered on the platform.
		// Automatically set to the current date and time.
	},
	password: {
		type: String,
		required: true,
		// The user's hashed password for secure authentication.
	},
	prizes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'League',
			// Prizes connected with league
		},
	],
	referralCode: {
		type: String,
		unique: true,
		required: true,
		// A unique promo code generated for this user, possibly to invite others to join the platform.
	},
	referredByCode: {
		type: String,
		default: null,
		// Promo code entered by the user, if they were referred by someone else.
		// Null until they use a promo code.
	},
	leagues: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'League',
			// An array of leagues the user is a part of.
			// Refers to a separate 'League' model that tracks league details.
		},
	],
	referredPeople: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			// An array of users that were referred by this user.
			// Allows tracking of how many people this user brought to the platform.
		},
	],
	status: {
		type: String,
		enum: ['active', 'suspended', 'deactivated'],
		default: 'active',
		// The user's current status in the system.
		// "active" - normal status, "suspended" - temporarily banned, "deactivated" - account closed.
	},
	lastLogin: {
		type: Date,
		default: Date.now,
		// Timestamp of the last time the user logged into the platform.
	},
	paymentInformation: {
		type: mongoose.Schema.Types.Mixed,
		default: null,
		// Placeholder for payment information (e.g., card details, subscription plans).
		// It can include data such as payment method, card expiration, etc.
	},
	acceptedTerms: {
		type: Boolean,
		required: true,
		// Boolean flag indicating whether the user has accepted the platform's terms and conditions which is required for registration..
	},
	isVerified: {
		type: Boolean,
		default: false, // Default to false until email is verified
		// Boolean flag to indicate if the user's email is verified
	},
	isDeleted: {
		type: Boolean,
		default: false, // Default to false until email is verified
		// Boolean flag to indicate if the user's email is verified
	},
	verificationCode: {
		type: String,
		required: function () {
			return !this.isVerified
		}, // Required if not verified
		// 4-digit verification code sent to the user's email
	},
	codeExpires: {
		type: Date,
		required: function () {
			return !this.isVerified
		}, // Required if not verified
		// Expiration time for the verification code
	},
	paymentHistory: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Payment',
			// An array of payment records related to this user.
			// Refers to a 'Payment' model that holds transaction details.
		},
	],
	passwordUpdatedAt: {
		type: Date,
		// Timestamp of the last time the user updated their password.
	},
	badges: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Badge',
		},
	],

	resetPasswordToken: {
		type: String,
		// Token used for password reset
	},
	resetPasswordExpires: {
		type: Date,
		// Expiration time for the reset token
	},
	failedLoginAttempts: {
		type: Number,
		default: 0,
		// How many failed Attempts user have done.
	},
	lastFailedLogin: {
		type: Date,
		// The users last failed login attempt
	},
	isLocked: {
		type: Boolean,
		default: false,
		// Is the user account blocked.
	},
	settings: {
		preferredLanguage: {
			type: String,
			enum: ['en', 'am', 'ru'],
			default: 'en',
			// The user's preferred language for the platform.
			// Default is set to "en" (English), but can be customized.
		},
		wantsNotifications: {
			type: Boolean,
			default: false,
			// False means the user has opted out of notifications, true means they want notifications
		},
	},
})

// Virtual Properties
// Virtual property to get the user's full name by combining firstName and lastName
userSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`
})
// Virtual property to check if the user was referred by someone
userSchema.virtual('isReferred').get(function () {
	return !!this.referredByCode
})
// Virtual property to get the count of people the user has referred
userSchema.virtual('referredPeopleCount').get(function () {
	return this.referredPeople.length
})

// Middlewares
// Middleware to hash the password before saving
userSchema.pre('save', hash)

// Methods
// Method to compare given password with the hashed password
userSchema.methods.comparePassword = compare

// Exporting the model to be used in the application
const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User

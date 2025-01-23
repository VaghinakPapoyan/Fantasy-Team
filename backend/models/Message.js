// Importing required packages
import mongoose from 'mongoose'

const { Schema } = mongoose

// Define the Message Schema
const MessageSchema = new Schema(
	{
		// Field to indicate if the sender is a User or an Admin
		senderType: {
			type: String, // Data type is String
			enum: ['user', 'admin'], // Restrict the values to either 'User' or 'Admin'
			required: true, // This field is required
		},
		// Reference to the user who sent the message
		userId: {
			type: mongoose.Schema.Types.ObjectId, // This links to an ObjectId from the User collection
			ref: 'User', // Reference to the 'User' model
			required: true, // This field is required
		},
		// The subject of the message
		subject: {
			type: String, // Data type is String
			required: true, // This field is required
		},
		// The content of the message
		messageBody: {
			type: String, // Data type is String
			required: true, // This field is required
		},
		// The date and time when the message was created
		createdAt: {
			type: Date, // Data type is Date
			default: Date.now, // Default value is the current date and time
		},
		// The date and time when the message was last updated
		updatedAt: {
			type: Date, // Data type is Date
			default: Date.now, // Default value is the current date and time
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
)

// Middleware to update the updatedAt field before saving
MessageSchema.pre('save', function (next) {
	this.updatedAt = Date.now() // Set the updatedAt field to the current date and time
	next() // Proceed to the next middleware or save operation
})

const Message =
	mongoose.models.Message || mongoose.model('Message', MessageSchema)
// Exporting the Message model
export default Message

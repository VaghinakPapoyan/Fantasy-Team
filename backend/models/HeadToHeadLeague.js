// Import External Dependencies
import mongoose from 'mongoose'

// Define the Head-to-Head Schema
const h2hSchema = new mongoose.Schema(
	{
		leagueId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'League',
			required: true,
			// Reference to the league this H2H competition belongs to
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
				// Array of users participating in this H2H league
			},
		],
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
)

// Exporting the H2H model to be used in the application
const H2H = mongoose.models.H2H || mongoose.model('H2H', h2hSchema)
export default H2H

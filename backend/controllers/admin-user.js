import User from '../models/user.js'
import UserLeague from '../models/UserLeague.js'
import League from '../models/league.js'
import Badge from '../models/badge.js'
import Prize from '../models/prize.js'
import accountLockout from '../utils/accountLockout.js'
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js'
import mongoose from 'mongoose'
import { generateReferralCode } from '../utils/referral.js'

// Get all users with optional pagination and search capabilities
export async function getAllUsers(req, res) {
	try {
		// Optional query parameters for pagination and search
		const pageSize = Number(req.query.pageSize) // Number of users per page
		const page = Number(req.query.pageNumber) // Current page number

		// Optional keyword search on firstName, lastName, or email
		const keyword = req.query.keyword
			? {
					$or: [
						{ firstName: { $regex: req.query.keyword, $options: 'i' } },
						{ lastName: { $regex: req.query.keyword, $options: 'i' } },
						{ email: { $regex: req.query.keyword, $options: 'i' } },
						// Use mongoose.Types.ObjectId for ID search
						...(mongoose.Types.ObjectId.isValid(req.query.keyword)
							? [{ _id: new mongoose.Types.ObjectId(req.query.keyword) }]
							: []),
					],
			  }
			: {}

		// Get total count of users matching the search criteria
		const count = await User.countDocuments({ ...keyword })

		// Fetch users from the database with pagination and keyword filter
		const users = await User.find({ ...keyword })
			.select('-password -verificationCode') // Exclude sensitive fields like password and verification code
			.limit(pageSize ? pageSize : 0)
			.skip(pageSize * (page - 1))
		// .populate('leagues') // Optionally populate 'leagues' field if needed

		// Send response with users data and pagination info
		res.status(200).json({
			success: true,
			users,
			page,
			pages: Math.ceil(count / pageSize),
			totalUsers: count,
		})
	} catch (error) {
		// Log error and send a 500 server error response
		console.error(error)
		res.status(500).json({ success: false, message: 'Server Error' })
	}
}

// Admin Login route
export async function adminLogin(req, res) {
	try {
		// Extract email and password from request body
		const { email, password } = req.body

		// Validate required fields
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: 'Email and password are required.' }) // Return 400 if email or password is missing
		}

		// Find user by email, ensuring they are a super-admin
		const user = await User.findOne({ email, role: 'super-admin' })
		if (!user) {
			return res.status(400).json({ message: 'Invalid email or password.' }) // Return 400 if user is not found
		}

		// Apply account lockout logic if there are too many failed login attempts
		accountLockout(res, user, 60, 1 * process.env.RateLimitMultiply)

		// Check if password matches
		const isMatch = await user.comparePassword(password)
		if (!isMatch) {
			// Increment failed login attempts if password doesn't match
			user.failedLoginAttempts += 1
			user.lastFailedLogin = new Date()

			await user.save() // Save user with updated failed attempts
			return res.status(400).json({ message: 'Invalid email or password.' })
		}

		// Reset failed login attempts and update last login timestamp
		user.failedLoginAttempts = 0
		user.lastLogin = new Date()
		await user.save() // Save user with updated information

		// Generate JWT token for session authentication
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '20m' } // Token expires in 20 minutes
		)

		// Set JWT token as a secure cookie
		res.cookie('token', token, {
			httpOnly: true, // Makes the cookie inaccessible to JavaScript, helps prevent XSS
			secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
			sameSite: 'Strict', // Helps prevent CSRF; adjust as needed
			maxAge: 20 * 60 * 1000, // Set cookie lifespan to 20 minutes
		})
		res.status(200).json({ message: 'Login successful.' })
	} catch (error) {
		// Log error and send a 500 server error response
		console.error(error)
		res.status(500).json({ message: 'Server error.' })
	}
}

// Delete user by ID
export async function deleteUser(req, res) {
	try {
		// Get user ID from request parameters
		const { userId } = req.params

		// Validate if userId is provided
		if (!userId) {
			return res.status(400).json({ message: 'User ID is required.' }) // Return 400 if userId is missing
		}

		// Find user by ID
		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ message: 'User not found.' }) // Return 404 if user is not found
		}

		// Delete user by ID
		await User.findByIdAndDelete(userId)

		// Send success response after deletion
		res.status(200).json({ message: 'User deleted successfully.' })
	} catch (error) {
		// Log error and send a 500 server error response
		console.error(error)
		res.status(500).json({ message: 'Server error.' })
	}
}

// Get user by ID
export const getUserById = async (req, res) => {
	try {
		// Find user by ID and optionally populate related fields
		const user = await User.findById(req.params.userId)
		// .populate('leagues')
		// .populate('referredPeople')
		// .populate('paymentHistory')

		if (user) {
			// Send user data as response
			res.json(user)
		} else {
			// Return 404 if user is not found
			res.status(404)
			res.json({ message: 'User not found' })
		}
	} catch (error) {
		// Send a 500 server error response
		res.status(500)
		res.json({ message: error.message })
	}
}

// Update user by ID
export async function updateUserById(req, res) {
	// Start a MongoDB session for transaction
	const session = await mongoose.startSession()

	try {
		// Start transaction
		session.startTransaction()

		// Find user by ID
		const user = await User.findById(req.params.userId).session(session)

		if (user) {
			// Store original leagues
			const originalLeagues = user.leagues.map(league => league.toString())

			// Destructure the fields from the request body
			const {
				role,
				firstName,
				lastName,
				email,
				dateOfBirth,
				status,
				isVerified,
				leagues,
				badges,
				prizes,
				settings,
				password,
				referralCode,
				referredByCode,
				referredPeople,
				lastLogin,
				paymentInformation,
				acceptedTerms,
				verificationCode,
				codeExpires,
				paymentHistory,
				resetPasswordToken,
				resetPasswordExpires,
				failedLoginAttempts,
				lastFailedLogin,
				isLocked,
				isDeleted,
			} = req.body

			// Update user fields if they are provided in request
			if (role) user.role = role
			if (firstName) user.firstName = firstName
			if (lastName) user.lastName = lastName
			if (email) user.email = email
			if (dateOfBirth) user.dateOfBirth = dateOfBirth
			if (status) user.status = status
			if (isVerified !== undefined) user.isVerified = isVerified
			if (isDeleted !== undefined) user.isDeleted = isDeleted
			if (badges) user.badges = badges
			if (prizes) user.prizes = prizes
			if (settings) user.settings = settings
			if (referralCode) user.referralCode = referralCode
			if (referredByCode) user.referredByCode = referredByCode
			if (referredPeople) user.referredPeople = referredPeople
			if (lastLogin) user.lastLogin = lastLogin
			if (paymentInformation) user.paymentInformation = paymentInformation
			if (acceptedTerms !== undefined) user.acceptedTerms = acceptedTerms
			if (verificationCode) user.verificationCode = verificationCode
			if (codeExpires) user.codeExpires = codeExpires
			if (paymentHistory) user.paymentHistory = paymentHistory
			if (resetPasswordToken) user.resetPasswordToken = resetPasswordToken
			if (resetPasswordExpires) user.resetPasswordExpires = resetPasswordExpires
			if (failedLoginAttempts !== undefined)
				user.failedLoginAttempts = failedLoginAttempts
			if (lastFailedLogin) user.lastFailedLogin = lastFailedLogin
			if (isLocked !== undefined) user.isLocked = isLocked

			// Handle password update if provided
			if (password) {
				user.password = password
				user.passwordUpdatedAt = Date.now() // Update password updated timestamp
			}

			// Update user's leagues and adjust league documents accordingly
			if (leagues) {
				// Convert league IDs to strings for comparison
				const newLeagues = leagues.map(league => league.toString())

				// Find leagues added and removed
				const leaguesAdded = newLeagues.filter(
					leagueId => !originalLeagues.includes(leagueId)
				)
				const leaguesRemoved = originalLeagues.filter(
					leagueId => !newLeagues.includes(leagueId)
				)

				// Update user's leagues
				user.leagues = leagues

				// Update added leagues: add user to league's users array and create UserLeagueInfo
				for (const leagueId of leaguesAdded) {
					// Add user to league's users array
					await League.findByIdAndUpdate(
						leagueId,
						{
							$addToSet: { users: user._id },
						},
						{ session }
					)

					// Check if UserLeagueInfo already exists
					const existingUserLeagueInfo = await UserLeague.findOne({
						userId: user._id,
						leagueId: leagueId,
					}).session(session)

					// Create UserLeagueInfo if it doesn't exist
					if (!existingUserLeagueInfo) {
						const userLeagueInfo = new UserLeague({
							userId: user._id, // Reference to the user
							leagueId: leagueId, // Reference to the league
							teamName: `${user.firstName}'s Team`, // Default team name
							teamLogo: '', // Empty team logo
							currentPoints: 0, // Starting with zero points
							currentRank: null, // Rank will be calculated later
							activity: 0, // No activity yet
							isActive: true, // User is active in the league
							joinedAt: Date.now(), // Timestamp of joining
							lastUpdated: Date.now(), // Timestamp of last update
							lastActiveAt: Date.now(), // Timestamp of last activity
							allBoosters: [], // No boosters assigned yet
							badges: [], // No badges earned yet
							headToHeadStats: {
								winRate: 0, // Initial win rate
								streaks: {
									currentStreak: 0, // No current streak
									bestStreak: 0, // No best streak yet
								},
							},
							notifications: [], // No notifications yet
							weekNumber: 0, // Starting week number
							gameWeeks: [], // No gameweek data yet
						})

						// Save the UserLeagueInfo document within the transaction
						await userLeagueInfo.save({ session })
					}
				}

				// Update removed leagues: remove user from league's users array and UserLeagueInfo
				for (const leagueId of leaguesRemoved) {
					// Remove user from league's users array
					await League.findByIdAndUpdate(
						leagueId,
						{
							$pull: { users: user._id },
						},
						{ session }
					)

					// Remove UserLeagueInfo for this user and league
					await UserLeague.findOneAndDelete(
						{
							userId: user._id,
							leagueId: leagueId,
						},
						{ session }
					)
				}
			}

			// Update user's badges and prizes
			if (badges) {
				const originalBadges = user.badges.map(badge => badge.toString())
				const newBadges = badges.map(badge => badge.toString())

				const badgesAdded = newBadges.filter(
					badgeId => !originalBadges.includes(badgeId)
				)
				const badgesRemoved = originalBadges.filter(
					badgeId => !newBadges.includes(badgeId)
				)

				// Update user’s badges
				user.badges = badges

				// Update added badges: add user to badge's users array
				for (const badgeId of badgesAdded) {
					await Badge.findByIdAndUpdate(badgeId, {
						$addToSet: { users: user._id },
					})
				}

				// Update removed badges: remove user from badge's users array
				for (const badgeId of badgesRemoved) {
					await Badge.findByIdAndUpdate(badgeId, { $pull: { users: user._id } })
				}
			}

			if (prizes) {
				const originalPrizes = user.prizes.map(prize => prize.toString())
				const newPrizes = prizes.map(prize => prize.toString())

				const prizesAdded = newPrizes.filter(
					prizeId => !originalPrizes.includes(prizeId)
				)
				const prizesRemoved = originalPrizes.filter(
					prizeId => !newPrizes.includes(prizeId)
				)

				// Update user’s prizes
				user.prizes = prizes

				// Update added prizes: add user to prize's users array
				for (const prizeId of prizesAdded) {
					await Prize.findByIdAndUpdate(prizeId, {
						$addToSet: { users: user._id },
					})
				}

				// Update removed prizes: remove user from prize's users array
				for (const prizeId of prizesRemoved) {
					await Prize.findByIdAndUpdate(prizeId, { $pull: { users: user._id } })
				}
			}
			// Save updated user to database within the transaction
			const updatedUser = await user.save({ session })
			// Process referral if referredByCode is updated
			if (referredByCode) {
				try {
					const referringUser = await User.findOne({
						referralCode: referredByCode,
					})

					if (referringUser) {
						await User.findByIdAndUpdate(
							referringUser._id,
							{
								$addToSet: { referredPeople: updatedUser._id },
							},
							{
								new: true,
								runValidators: true,
								session,
							}
						)
					} else {
						console.warn(`No user found with referral code: ${referredByCode}`)
					}
				} catch (referralError) {
					console.error('Error processing referral:', referralError)
				}
			}

			// Commit the transaction
			await session.commitTransaction()
			session.endSession()

			return res.json(updatedUser) // Send updated user data as response
		} else {
			// Abort transaction if user not found
			await session.abortTransaction()
			session.endSession()

			// Return 404 if user is not found
			res.status(404)
			return res.json({ message: 'User not found' })
		}
	} catch (error) {
		// Abort transaction in case of error
		await session.abortTransaction()
		session.endSession()

		// Handle duplicate key error (e.g., email already exists)
		if (error.code === 11000) {
			res.status(400)
			res.json({ message: 'Email already in use' })
		} else {
			// Send a 500 server error response
			res.status(500)
			res.json({ message: error.message })
		}
	}
}

// Send email to user by ID
export async function sendUserMail(req, res) {
	// Extract user ID from request parameters and email details from body
	const { userId } = req.params
	const { subject, message } = req.body

	try {
		// Find user by ID
		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ message: 'User not found.' }) // Return 404 if user is not found
		}

		// Use utility function to send email
		await sendEmail(user.email, subject, message)

		// Send success response after email is sent
		res.status(200).json({ message: 'Email sent successfully.' })
	} catch (err) {
		// Log error and send a 500 server error response
		console.error(err)
		res.status(500).json({ message: 'Failed to send email.' })
	}
}

export const createUser = async (req, res) => {
	try {
		// Extract user data from the request body
		const userData = req.body

		// Destructure required fields from userData
		const {
			firstName,
			lastName,
			email,
			password,
			acceptedTerms,
			prizes,
			dateOfBirth,
			referralCode,
			leagues, // Make sure to include leagues from the request body
			referredByCode,
		} = userData

		// Validate required fields
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			acceptedTerms === undefined ||
			!dateOfBirth
		) {
			// If required fields are missing, send a 400 Bad Request response
			return res.status(400).json({
				message:
					'First name, last name, email, password, date of birth, and accepted terms are required',
			})
		}

		// Check if a user with the same email already exists
		const existingUser = await User.findOne({ email: email.toLowerCase() })
		if (existingUser) {
			// If user exists, send a 400 Bad Request response
			return res
				.status(400)
				.json({ message: 'User with this email already exists' })
		}

		// Check if referralCode is provided; if not, generate a unique referral code
		if (!referralCode) {
			let generatedCode = await generateReferralCode()
			userData.referralCode = generatedCode // Assign the generated code to userData
		} else {
			// If referralCode is provided, check if it's unique
			const codeExists = await User.findOne({ referralCode })
			if (codeExists) {
				// If referral code exists, send a 400 Bad Request response
				return res.status(400).json({ message: 'Referral code already exists' })
			}
		}

		// Parse dateOfBirth
		const parsedDateOfBirth = new Date(dateOfBirth)
		if (isNaN(parsedDateOfBirth)) {
			// If dateOfBirth is not a valid date, send a 400 Bad Request response
			return res.status(400).json({ message: 'Invalid date of birth' })
		}

		// Validate role if provided
		if (
			userData.role &&
			!['registered', 'premium', 'super-admin'].includes(userData.role)
		) {
			// If role is invalid, send a 400 Bad Request response
			return res.status(400).json({ message: 'Invalid role' })
		}

		// Validate status if provided
		if (
			userData.status &&
			!['active', 'suspended', 'deactivated'].includes(userData.status)
		) {
			// If status is invalid, send a 400 Bad Request response
			return res.status(400).json({ message: 'Invalid status' })
		}

		// Validate preferredLanguage if provided
		if (
			userData.settings &&
			userData.settings.preferredLanguage &&
			!['en', 'am', 'ru'].includes(userData.settings.preferredLanguage)
		) {
			// If preferred language is invalid, send a 400 Bad Request response
			return res.status(400).json({ message: 'Invalid preferred language' })
		}

		// Validate leagues if provided
		if (userData.leagues && userData.leagues.length > 0) {
			// Ensure all league IDs are valid ObjectIds
			const areValidLeagues = userData.leagues.every(leagueId =>
				mongoose.Types.ObjectId.isValid(leagueId)
			)
			if (!areValidLeagues) {
				// If any league ID is invalid, send a 400 Bad Request response
				return res
					.status(400)
					.json({ message: 'One or more invalid league IDs' })
			}
		}

		// Validate referredPeople if provided
		if (userData.referredPeople && userData.referredPeople.length > 0) {
			// Ensure all referredPeople IDs are valid ObjectIds
			const areValidUsers = userData.referredPeople.every(userId =>
				mongoose.Types.ObjectId.isValid(userId)
			)
			if (!areValidUsers) {
				// If any referred user ID is invalid, send a 400 Bad Request response
				return res.status(400).json({
					message: 'One or more invalid referred user IDs',
				})
			}
		}

		// Validate paymentHistory if provided
		if (userData.paymentHistory && userData.paymentHistory.length > 0) {
			// Ensure all paymentHistory IDs are valid ObjectIds
			const areValidPayments = userData.paymentHistory.every(paymentId =>
				mongoose.Types.ObjectId.isValid(paymentId)
			)
			if (!areValidPayments) {
				// If any payment ID is invalid, send a 400 Bad Request response
				return res
					.status(400)
					.json({ message: 'One or more invalid payment IDs' })
			}
		}

		// Prepare user data
		const newUserData = {
			firstName,
			lastName,
			email: email.toLowerCase(), // Ensure email is stored in lowercase
			password,
			dateOfBirth: parsedDateOfBirth,
			acceptedTerms,
			role: userData.role, // Validated above
			status: userData.status, // Validated above
			leagues: userData.leagues,
			referredPeople: userData.referredPeople,
			paymentHistory: userData.paymentHistory,
			badges: userData.badges,
			prizes: userData.prizes,
			settings: userData.settings,
			referralCode: userData.referralCode, // Assigned above
			referredByCode: userData.referredByCode,
			isVerified: userData.isVerified || false,
			isDeleted: userData.isDeleted || false,
			dateOfRegistration: Date.now(),
			lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : Date.now(),
			passwordUpdatedAt: userData.passwordUpdatedAt
				? new Date(userData.passwordUpdatedAt)
				: null,
			resetPasswordToken: userData.resetPasswordToken,
			resetPasswordExpires: userData.resetPasswordExpires
				? new Date(userData.resetPasswordExpires)
				: null,
			failedLoginAttempts: userData.failedLoginAttempts || 0,
			lastFailedLogin: userData.lastFailedLogin
				? new Date(userData.lastFailedLogin)
				: null,
			isLocked: userData.isLocked || false,
			verificationCode: userData.verificationCode,
			codeExpires: userData.codeExpires ? new Date(userData.codeExpires) : null,
			paymentInformation: userData.paymentInformation || null,
		}

		// Start a session for transaction
		const session = await mongoose.startSession()
		session.startTransaction()

		try {
			// Create a new User instance with the provided data
			const user = new User(newUserData)

			// After saving the user, update the Badge and Prize collections
			if (userData.badges && userData.badges.length > 0) {
				for (const badgeId of userData.badges) {
					await Badge.findByIdAndUpdate(
						badgeId,
						{ $addToSet: { users: user._id } }, // Add user to each badge's users array
						{ session }
					)
				}
			}

			if (userData.prizes && userData.prizes.length > 0) {
				for (const prizeId of userData.prizes) {
					await Prize.findByIdAndUpdate(
						prizeId,
						{ $addToSet: { players: user._id } }, // Add user to each prize's users array
						{ session }
					)
				}
			}

			// Save the new user to the database within the transaction
			await user.save({ session })

			// Find the user who referred this new user
			if (referredByCode) {
				try {
					const referringUser = await User.findOne({
						referralCode: referredByCode,
					})

					if (referringUser) {
						// Add the new user's ID to the referring user's referredPeople array
						await User.findByIdAndUpdate(
							referringUser._id,
							{
								$addToSet: { referredPeople: user._id },
							},
							{
								new: true, // Return the updated document
								runValidators: true, // Run mongoose validators
							}
						)
					} else {
						// Log a warning if the referral code doesn't match any existing user
						console.warn(`No user found with referral code: ${referredByCode}`)
					}
				} catch (referralError) {
					// Log the error but don't stop the user creation process
					console.error('Error processing referral:', referralError)
				}
			}

			// Now update the leagues: add user to league's users array
			if (userData.leagues && userData.leagues.length > 0) {
				// Ensure we update each league to add the user to the league's users array
				for (const leagueId of userData.leagues) {
					await League.findByIdAndUpdate(
						leagueId,
						{ $addToSet: { users: user._id } },
						{ session }
					)
				}
			}

			// Commit the transaction
			await session.commitTransaction()
			session.endSession()

			// Remove sensitive fields before sending the response
			const userResponse = user.toObject()
			delete userResponse.password
			delete userResponse.resetPasswordToken
			delete userResponse.resetPasswordExpires

			// Send a success response with the created user
			res.status(201).json({
				message: 'User created successfully',
				user: userResponse,
			})
		} catch (error) {
			// If an error occurs, abort the transaction
			await session.abortTransaction()
			session.endSession()
			// Pass the error to the outer catch block
			throw error
		}
	} catch (error) {
		// If an error occurs, send a 500 Internal Server Error response
		res.status(500).json({ message: error.message })
	}
}

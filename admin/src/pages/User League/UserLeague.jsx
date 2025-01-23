// Import necessary dependencies
import React, { useState, useEffect } from 'react' // React and hooks\
import axiosInstance from '../../axiosInstance' // Axios instance for API calls
import { useParams, useNavigate } from 'react-router-dom' // Hooks for routing
import { toast } from 'react-toastify' // For displaying toast notifications
import './style/user-league.scss' // Stylesheet
import Loading from '../../components/Loading.jsx' // Loading componenti
import Select from 'react-select' // Select component

import GameWeekInfo from './GameWeekInfo.jsx'

// Define the UserLeague component
export default function UserLeague() {
	// Extract 'userId' and 'leagueId' parameters from the URL using useParams()
	const { userId, leagueId } = useParams()

	// State to store UserLeague data
	const [userLeague, setUserLeague] = useState(null)

	// State to indicate loading while fetching data
	const [loading, setLoading] = useState(false)

	// State to store error message if any error occurs
	const [error, setError] = useState('')

	// State to store form data
	const [formData, setFormData] = useState({
		userId: '', // User ID reference
		leagueId: '', // League ID reference
		userName: '', // User's name or email
		leagueName: '', // League's name or description
		currentPoints: 0, // Current total points
		currentRank: null, // User's current rank in the league
		activity: 0, // Number of actions performed
		teamName: '', // Name of the user's team
		teamLogo: '', // URL or path to the team's logo image
		gameWeeks: [], // Array of gameweek data
		weekNumber: 0, // Current game-week number
		notifications: [], // Notifications array
		isActive: true, // User's active status in the league
		joinedAt: new Date(), // When the user joined the league
		lastUpdated: new Date(), // Last update timestamp
		lastActiveAt: new Date(), // Timestamp of last activity
		headToHeadStats: {
			winRate: 0, // Win rate in head-to-head matches
			streaks: {
				currentStreak: 0, // Current streak count
				bestStreak: 0, // Best streak achieved
			},
		},
	})

	const navigate = useNavigate() // Hook to navigate programmatically

	// useEffect to fetch UserLeague data when component mounts
	useEffect(() => {
		fetchUserLeague() // Fetch UserLeague data
	}, [])

	// Function to fetch UserLeague data
	const fetchUserLeague = async () => {
		setLoading(true) // Set loading state to true while fetching
		try {
			// Make API call to fetch UserLeague data
			const { data } = await axiosInstance.get(
				`/user-leagues/${userId}/${leagueId}`
			)

			setUserLeague(data.UserLeague) // Set the fetched data to state
			// Set form data with fetched UserLeague data
			setFormData({
				// Direct fields from the UserLeagueInfo model
				userName: data.UserLeague.userId?.email || '',
				leagueName: data.UserLeague.leagueId?.description || '',
				teamName: data.UserLeague.teamName || '',
				currentPoints: data.UserLeague.currentPoints || 0,
				currentRank: data.UserLeague.currentRank || null,
				activity: data.UserLeague.activity || 0,
				isActive:
					data.UserLeague.isActive !== undefined
						? data.UserLeague.isActive
						: true,
				joinedAt: data.UserLeague.joinedAt || new Date(),
				lastUpdated: data.UserLeague.lastUpdated || new Date(),
				lastActiveAt: data.UserLeague.lastActiveAt || new Date(),
				teamLogo: data.UserLeague.teamLogo || '',

				// Boosters
				allBoosters: data.UserLeague.allBoosters || [],

				// Head-to-Head stats
				headToHeadStats: data.UserLeague.headToHeadStats || {
					winRate: 0,
					streaks: {
						currentStreak: 0,
						bestStreak: 0,
					},
				},

				// Gameweeks
				gameWeeks: data.UserLeague.gameWeeks || [],

				// Notifications
				notifications: data.UserLeague.notifications || [],

				// User and League references
				userId: data.UserLeague.userId?._id || '',
				leagueId: data.UserLeague.leagueId?._id || '',
			})

			setLoading(false) // Set loading state to false after fetching
		} catch (err) {
			console.log(err)

			setError('Failed to fetch UserLeague data.') // Set error state if fetching fails
			setLoading(false) // Set loading state to false after error
			toast.error('Failed to fetch UserLeague data.') // Display error message
		}
	}
	const handleAddNotification = () => {
		const newNotification = {
			message: formData.notificationMessage,
			isRead: formData.notificationIsRead === 'true' ? true : false,
			createdAt: formData.notificationCreatedAt || new Date().toISOString(),
		}

		setFormData({
			...formData,
			notifications: [...formData.notifications, newNotification],
			notificationMessage: '',
			notificationIsRead: false,
			notificationCreatedAt: '',
		})
	}

	// Helper function to parse the name into a path array
	const parsePath = name => {
		const path = []
		const regex = /([^[.\]]+)|\[(\d+)\]/g
		let match
		while ((match = regex.exec(name)) !== null) {
			if (match[1]) {
				path.push(match[1])
			}
			if (match[2]) {
				path.push(Number(match[2])) // Convert array indices to numbers
			}
		}
		return path
	}

	// Helper function to immutably set a value at a given path in an object
	const setNestedValue = (obj, path, value) => {
		if (path.length === 0) return value

		const [key, ...rest] = path

		// Determine if the current key is an array index or object key
		const isArray = Array.isArray(obj) || typeof key === 'number'

		const newObj = isArray ? [...(obj || [])] : { ...(obj || {}) }

		newObj[key] = setNestedValue(newObj[key], rest, value)

		return newObj
	}

	// Main handleChange function
	const handleChange = e => {
		const { name, value, type, checked } = e.target

		const path = parsePath(name)

		setFormData(prevData => {
			let newValue

			// Determine the new value based on input type
			if (type === 'checkbox') {
				newValue = checked
			} else if (type === 'number' || type === 'range') {
				newValue = value === '' ? '' : parseFloat(value)
			} else if (e.target.tagName === 'TEXTAREA') {
				// Handle special cases for textareas
				if (name === 'team.transferHistory' || name === 'gameWeeks') {
					try {
						newValue = JSON.parse(value)
					} catch (error) {
						console.error(`Invalid JSON in ${name}`)
						toast.error(`Invalid JSON in ${name}`)
						return prevData // Return previous data without changes
					}
				} else if (name === 'team.players') {
					// Handle as array of player IDs
					newValue = value.split('\n').filter(v => v.trim() !== '')
				} else if (name === 'transfersMade') {
					// Handle as array of IDs
					newValue = value.split('\n').filter(v => v.trim() !== '')
				} else {
					newValue = value
				}
			} else {
				newValue = value
			}

			// Update the formData using setNestedValue
			const newData = setNestedValue(prevData, path, newValue)
			return newData
		})
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault() // Prevent default form submission behavior
		try {
			// Make API call to update UserLeague data
			await axiosInstance.put(`/user-leagues/${userId}/${leagueId}`, formData)
			toast.success('UserLeague updated successfully.') // Display success message
			navigate(`/users/${userId}`) // Navigate back to user page or wherever appropriate
		} catch (err) {
			// Handle error during submission
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message) // Display specific error message from server
			} else {
				toast.error('Failed to update UserLeague.') // Display generic error message
			}
		}
	}

	// Display loading state
	if (loading) {
		return (
			<div className='dfjccaic user-league-page'>
				<Loading />
			</div>
		)
	}

	// Display error message
	if (error) {
		return <div className='error-message'>{error}</div>
	}

	// Render the form
	return (
		<div className='user-league-page'>
			<h1 className='title'>Edit UserLeague</h1>
			<form className='user-league-form' onSubmit={handleSubmit}>
				{/* User Name */}
				<div className='form-group'>
					<label>User Name:</label>
					<input
						disabled
						type='text'
						name='userName'
						value={formData.userName || ''}
						onChange={handleChange}
						required
					/>
				</div>

				{/* League Name */}
				<div className='form-group'>
					<label>League Name:</label>
					<input
						disabled
						type='text'
						name='leagueName'
						value={formData.leagueName || ''}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Team Name */}
				<div className='form-group'>
					<label>Team Name:</label>
					<input
						type='text'
						name='teamName'
						value={formData.teamName || ''}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Total Points */}
				<div className='form-group'>
					<label>Total Points:</label>
					<input
						type='number'
						name='currentPoints'
						value={formData.currentPoints}
						onChange={handleChange}
					/>
				</div>

				{/* Overall Rank */}
				<div className='form-group'>
					<label>Overall Rank:</label>
					<input
						type='number'
						name='currentRank'
						value={formData.currentRank || ''}
						onChange={handleChange}
					/>
				</div>

				{/* Activity */}
				<div className='form-group'>
					<label>Activity:</label>
					<input
						type='number'
						name='activity'
						value={formData.activity}
						onChange={handleChange}
					/>
				</div>

				{/* Is Active */}
				<div className='form-group'>
					<label>Is Active:</label>
					<input
						type='checkbox'
						name='isActive'
						checked={formData.isActive}
						onChange={handleChange}
					/>
				</div>

				{/* Joined At */}
				<div className='form-group'>
					<label>Joined At:</label>
					<input
						type='date'
						name='joinedAt'
						value={
							formData?.joinedAt
								? new Date(formData.joinedAt).toISOString().slice(0, 10)
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Last Updated */}
				<div className='form-group'>
					<label>Last Updated:</label>
					<input
						disabled
						type='date'
						name='lastUpdated'
						value={
							formData?.lastUpdated
								? new Date(formData.lastUpdated).toISOString().slice(0, 10)
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Last Active At */}
				<div className='form-group'>
					<label>Last Active At:</label>
					<input
						type='date'
						name='lastActiveAt'
						value={
							formData?.lastActiveAt
								? new Date(formData.lastActiveAt).toISOString().slice(0, 10)
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Team Logo */}
				<div className='form-group'>
					<label>Team Logo URL:</label>
					<input
						type='text'
						name='teamLogo'
						value={formData.teamLogo || ''}
						onChange={handleChange}
					/>
				</div>

				{/* Head-to-Head Stats */}
				<div className='form-group'>
					<label>Head-to-Head Win Rate:</label>
					<input
						type='number'
						name='headToHeadStats.winRate'
						value={formData.headToHeadStats.winRate}
						onChange={handleChange}
						step='0.01'
					/>
				</div>

				<div className='form-group'>
					<label>Current Streak:</label>
					<input
						type='number'
						name='headToHeadStats.streaks.currentStreak'
						value={formData.headToHeadStats.streaks.currentStreak}
						onChange={handleChange}
					/>
				</div>

				<div className='form-group'>
					<label>Best Streak:</label>
					<input
						type='number'
						name='headToHeadStats.streaks.bestStreak'
						value={formData.headToHeadStats.streaks.bestStreak}
						onChange={handleChange}
					/>
				</div>

				{/* Notifications */}
				<div className='form-group db'>
					<div>
						<div className='df mt-2'>
							<label>Notification Message:</label>
							<input
								type='text'
								name='notificationMessage'
								value={formData.notificationMessage}
								onChange={handleChange}
								placeholder='Enter notification message'
							/>
						</div>
						<div className='df mt-2'>
							<label>Is Read:</label>
							<select
								name='notificationIsRead'
								value={formData.notificationIsRead}
								onChange={handleChange}
							>
								<option value={false}>No</option>
								<option value={true}>Yes</option>
							</select>
						</div>
						<div className='df mt-2'>
							<label>Created At:</label>
							<input
								type='datetime-local'
								name='notificationCreatedAt'
								value={formData.notificationCreatedAt}
								onChange={handleChange}
							/>
						</div>
					</div>

					<button
						type='button'
						className='btn mt-2'
						onClick={handleAddNotification}
					>
						Add Notification
					</button>
					<div className='mt-2'>
						<label>Notifications:</label>
						<textarea
							name='notifications'
							value={JSON.stringify(formData.notifications, null, 2)}
							readOnly
						/>
					</div>
				</div>

				<GameWeekInfo
					formData={formData}
					setFormData={setFormData}
					setError={setError}
					toast={toast}
					leagueId={leagueId}
				/>

				{/* Save Button */}
				<button type='submit' className='btn btn-save'>
					Save Changes
				</button>
			</form>
		</div>
	)
}

// Import necessary dependencies
import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'
import './style/badge.scss'
import Loader from '../../components/Loading'

export default function Badge() {
	const { id } = useParams() // Extract the 'id' parameter from the URL using useParams()

	// State to store badge data and other necessary data
	const [badgeData, setBadgeData] = useState({
		name: '',
		description: '',
		iconUrl: '',
		condition: '',
		xpValue: 0,
		tags: '',
		leagues: [], // Updated to store multiple leagues instead of leagueId
		users: [],
	})
	const [leagues, setLeagues] = useState([]) // State to store list of leagues
	const [users, setUsers] = useState([]) // State to store list of users
	const [loading, setLoading] = useState(false) // State to indicate loading while fetching badge data
	const [error, setError] = useState('') // State to store error message if any error occurs
	const [loadingData, setLoadingData] = useState(true) // State to indicate if data is being fetched initially

	const navigate = useNavigate() // Hook to navigate programmatically

	// useEffect to fetch leagues and users initially when the component mounts
	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([fetchLeagues(), fetchUsers()]) // Fetch leagues and users simultaneously
			setLoadingData(false) // Set loadingData to false after fetching
		}
		fetchData() // Call the async function to fetch data
	}, [])

	// useEffect to fetch badge data if 'id' is present
	useEffect(() => {
		if (id) {
			fetchBadge() // Fetch the badge details if an ID is provided
		}
	}, [id])

	// Function to fetch all leagues
	const fetchLeagues = async () => {
		try {
			let { data } = await axiosInstance.get('/leagues/all') // Fetch all leagues from the server
			setLeagues(data) // Set the fetched leagues to state
		} catch (err) {
			toast.error('Failed to fetch leagues.') // Display error message if fetching fails
		}
	}

	// Function to fetch all users
	const fetchUsers = async () => {
		try {
			const { data } = await axiosInstance.get('/users/admin/all') // Fetch all users from the server
			setUsers(data.users) // Set the fetched users to state
		} catch (err) {
			toast.error('Failed to fetch users.') // Display error message if fetching fails
		}
	}

	// Function to fetch badge details based on ID
	const fetchBadge = async () => {
		setLoading(true) // Set loading state to true while fetching
		try {
			const { data } = await axiosInstance.get(`user-leagues/badge/${id}`) // Fetch badge data using the ID
			setBadgeData({
				name: data.badge.name || '',
				description: data.badge.description || '',
				iconUrl: data.badge.iconUrl || '',
				condition: data.badge.condition || '',
				xpValue: data.badge.xpValue || 0,
				tags: data.badge.tags.join(', ') || '', // Join tags array to form a comma-separated string
				leagues: data.badge.leagues || [], // Update leagues array in badgeData
				dateCreated: data.badge.dateCreated || '',
				users: data.badge.users || [],
			})
			setLoading(false) // Set loading state to false after fetching
		} catch (err) {
			setError('Failed to fetch badge.') // Set error state if fetching fails
			setLoading(false) // Set loading state to false after error
			toast.error('Failed to fetch badge.') // Display error message
		}
	}

	// Generic change handler for form inputs
	const handleChange = e => {
		const { name, value } = e.target // Extract name and value from the input field
		setBadgeData(prevData => ({
			...prevData, // Keep previous state
			[name]: value, // Update the specific field in badgeData
		}))
	}

	// Change handler for multi-select dropdown using react-select
	const handleUsersChange = selectedOptions => {
		const selectedUsers = selectedOptions
			? selectedOptions.map(option => option.value)
			: [] // Extract user IDs from selected options
		setBadgeData(prevData => ({
			...prevData, // Keep previous state
			users: selectedUsers, // Update users array in badgeData
		}))
	}

	// Change handler for multi-select dropdown for leagues using react-select
	const handleLeaguesChange = selectedOptions => {
		const selectedLeagues = selectedOptions
			? selectedOptions.map(option => option.value)
			: [] // Extract league IDs from selected options
		setBadgeData(prevData => ({
			...prevData, // Keep previous state
			leagues: selectedLeagues, // Update leagues array in badgeData
		}))
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault() // Prevent default form submission behavior
		try {
			const payload = {
				...badgeData,
				tags: badgeData.tags.split(',').map(tag => tag.trim()), // Split tags by comma and trim spaces
			}
			if (id) {
				// If ID exists, update existing badge
				await axiosInstance.put(`user-leagues/admin/badge/${id}`, payload)
				toast.success('Badge updated successfully.') // Display success message
			} else {
				// Otherwise, create a new badge
				await axiosInstance.post('/user-leagues/admin/badge', payload)
				toast.success('Badge created successfully.') // Display success message
			}
			navigate('/badges') // Navigate to badges page after successful submission
		} catch (err) {
			// Handle error during submission
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message) // Display specific error message from server
			} else {
				toast.error('Failed to submit badge.') // Display generic error message
			}
		}
	}

	// Display loading state if data is still being fetched
	if (loading || loadingData) {
		return (
			<div className='dfjccaic badge-form-page'>
				<Loader />
			</div>
		)
	}

	// Display error message if error state is set
	if (error) {
		return <div className='error-message'>{error}</div>
	}

	return (
		<div className='badge-form-page'>
			<h1 className='title'>{id ? 'Edit Badge' : 'Create Badge'}</h1>
			<form className='badge-form' onSubmit={handleSubmit}>
				{/* Badge Name */}
				<div className='form-group'>
					<label>Name:</label>
					<input
						type='text'
						name='name'
						value={badgeData.name}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Description */}
				<div className='form-group'>
					<label>Description:</label>
					<textarea
						name='description'
						value={badgeData.description}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Icon URL */}
				<div className='form-group'>
					<label>Icon URL:</label>
					<input
						type='text'
						name='iconUrl'
						value={badgeData.iconUrl}
						onChange={handleChange}
					/>
				</div>

				{/* Condition */}
				<div className='form-group'>
					<label>Condition:</label>
					<textarea
						name='condition'
						value={badgeData.condition}
						onChange={handleChange}
						required
					/>
				</div>

				{/* XP Value */}
				<div className='form-group'>
					<label>XP Value:</label>
					<input
						type='number'
						name='xpValue'
						value={badgeData.xpValue}
						onChange={handleChange}
						min='0'
						required
					/>
				</div>

				{/* Tags */}
				<div className='form-group'>
					<label>Tags:</label>
					<input
						type='text'
						name='tags'
						value={badgeData.tags}
						onChange={handleChange}
						placeholder='Enter tags separated by commas'
					/>
				</div>

				{/* Date Of Creation */}
				<div className='form-group'>
					<label>Date of Creation:</label>
					<input
						type='date'
						name='dateCreated'
						value={
							badgeData.dateCreated
								? new Date(badgeData.dateCreated).toISOString().split('T')[0]
								: null
						} // Format date to 'YYYY-MM-DD'
						onChange={handleChange}
						disabled // Disable input as dateCreated is not meant to be modified
					/>
				</div>

				{/* Leagues */}
				<div className='form-group db'>
					<label>Leagues:</label>
					<Select
						isMulti
						name='leagues'
						value={leagues
							.filter(league => badgeData.leagues.includes(league._id))
							.map(league => ({
								value: league._id,
								label: league.leagueName,
							}))}
						options={leagues.map(league => ({
							value: league._id,
							label: league.leagueName,
						}))}
						onChange={handleLeaguesChange} // Update badgeData.leagues on selection change
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Users */}
				<div className='form-group db'>
					<label>Users:</label>
					<Select
						isMulti
						name='users'
						value={users
							.filter(user => badgeData.users.includes(user._id))
							.map(user => ({
								value: user._id,
								label: `${user.firstName ? user.firstName : ''} ${
									user.lastName ? user.lastName : ''
								} (${user.email})`,
							}))} // Convert selected user IDs to react-select format
						options={users
							.filter(
								user => user.role === 'registered' || user.role === 'premium'
							)
							.map(user => ({
								value: user._id,
								label: `${user.firstName ? user.firstName : ''} ${
									user.lastName ? user.lastName : ''
								} (${user.email})`,
							}))} // Provide all users as options in react-select format
						onChange={handleUsersChange} // Update badgeData.users on selection change
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Save Button */}
				<button type='submit' className='btn btn-save'>
					{id ? 'Update Badge' : 'Create Badge'}
				</button>
			</form>
		</div>
	)
}

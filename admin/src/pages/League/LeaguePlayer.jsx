// src/pages/Player.jsx

import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading.jsx'

export default function Player() {
	// Get the player ID from the URL parameters
	const { playerId, id } = useParams()

	// State variables
	const [player, setPlayer] = useState(null) // Original player data
	const [formData, setFormData] = useState({}) // Form data for editing
	const [clubs, setClubs] = useState([]) // List of clubs for the dropdown
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState('') // Error message

	const navigate = useNavigate()

	// Fetch player and clubs data when component mounts or when ID changes
	useEffect(() => {
		fetchPlayer()
		fetchClubs()
	}, [playerId])

	// Function to fetch player data from the API
	const fetchPlayer = async () => {
		setLoading(true)
		try {
			const { data } = await axiosInstance.get(`leagues/players/${playerId}`)
			setPlayer(data)
			// Initialize form data with fetched player data
			setFormData({
				name: data.playerName || '',
				position: data.position || '',
				shirtNumber: data.shirtNumber || '',
				nationality: data.nationality || '',
				dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : '',
				countryOfBirth: data.countryOfBirth || '',
				role: data.role || '',
				marketValue: data.marketValue || '',
				club: data.team ? data.team._id : '', // Assuming club is populated
				lastUpdated: data.lastUpdated ? data.lastUpdated.substring(0, 10) : '',
			})
			setLoading(false)
		} catch (err) {
			setError('Failed to fetch player.')
			setLoading(false)
			toast.error('Failed to fetch player.')
		}
	}

	// Function to fetch clubs data for the dropdown
	const fetchClubs = async () => {
		try {
			const { data } = await axiosInstance.get('leagues/clubs/all/' + id)
			setClubs(data)
		} catch (err) {
			toast.error('Failed to fetch clubs.')
		}
	}

	// Handle input changes in the form
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault()
		// Prepare the data to be sent to the server

		const updatedPlayer = {
			playerName: formData.name,
			position: formData.position,
			shirtNumber: formData.shirtNumber,
			nationality: formData.nationality,
			dateOfBirth: formData.dateOfBirth,
			countryOfBirth: formData.countryOfBirth,
			role: formData.role,
			marketValue: formData.marketValue,
			team: formData.club,
			lastUpdated: formData.lastUpdated,
		}

		try {
			await axiosInstance.put(
				`/leagues/admin/players/${playerId}`,
				updatedPlayer
			)
			toast.success('Player updated successfully.')
			navigate('/leagues/players/' + id)
		} catch (err) {
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message)
			} else {
				toast.error('Failed to update player.')
			}
		}
	}

	if (loading) {
		return (
			<div className='player-page'>
				<Loading />
			</div>
		)
	}

	if (error) {
		return <div className='error-message'>{error}</div>
	}

	return (
		<div className='player-page'>
			<h1 className='title'>Edit Player</h1>
			{player && (
				<>
					<form className='player-form' onSubmit={handleSubmit}>
						{/* Name */}
						<div className='form-group'>
							<label>Name:</label>
							<input
								type='text'
								name='name'
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Position */}
						<div className='form-group'>
							<label>Position:</label>
							<input
								type='text'
								name='position'
								value={formData.position}
								onChange={handleChange}
							/>
						</div>

						{/* Shirt Number */}
						<div className='form-group'>
							<label>Shirt Number:</label>
							<input
								type='number'
								name='shirtNumber'
								value={formData.shirtNumber}
								onChange={handleChange}
							/>
						</div>

						{/* Nationality */}
						<div className='form-group'>
							<label>Nationality:</label>
							<input
								type='text'
								name='nationality'
								value={formData.nationality}
								onChange={handleChange}
							/>
						</div>

						{/* Date of Birth */}
						<div className='form-group'>
							<label>Date of Birth:</label>
							<input
								type='date'
								name='dateOfBirth'
								value={
									formData?.dateOfBirth
										? new Date(formData?.dateOfBirth)
												?.toISOString()
												?.split('T')[0]
										: new Date()?.toISOString()?.split('T')[0]
								}
								onChange={handleChange}
							/>
						</div>

						{/* Country of Birth */}
						<div className='form-group'>
							<label>Country of Birth:</label>
							<input
								type='text'
								name='countryOfBirth'
								value={formData.countryOfBirth}
								onChange={handleChange}
							/>
						</div>

						{/* Role */}
						<div className='form-group'>
							<label>Role:</label>
							<input
								type='text'
								name='role'
								value={formData.role}
								onChange={handleChange}
							/>
						</div>

						{/* Market Value */}
						<div className='form-group'>
							<label>Market Value:</label>
							<input
								type='number'
								name='marketValue'
								value={formData.marketValue}
								onChange={handleChange}
							/>
						</div>

						{/* Club */}
						<div className='form-group'>
							<label>Club:</label>
							<select name='club' value={formData.club} onChange={handleChange}>
								<option value=''>Select Club</option>
								{clubs.map(clubItem => (
									<option key={clubItem._id} value={clubItem._id}>
										{clubItem.clubName}
									</option>
								))}
							</select>
						</div>

						{/* Last Updated */}
						<div className='form-group'>
							<label>Last Updated:</label>
							<input
								type='date'
								name='lastUpdated'
								value={
									formData?.lastUpdated
										? new Date(formData?.lastUpdated)
												?.toISOString()
												?.split('T')[0]
										: new Date()?.toISOString()?.split('T')[0]
								}
								onChange={handleChange}
							/>
						</div>

						{/* Save Button */}
						<button type='submit' className='btn btn-save'>
							Save Changes
						</button>
					</form>
				</>
			)}
		</div>
	)
}

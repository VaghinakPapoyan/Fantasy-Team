// src/pages/Club.jsx

import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading.jsx'

export default function Club() {
	// Get the club ID from the URL parameters
	const { clubId, id } = useParams()

	// State variables
	const [club, setClub] = useState(null) // Original club data
	const [formData, setFormData] = useState({}) // Form data for editing
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState('') // Error message

	const navigate = useNavigate()

	// Fetch club data when component mounts or when ID changes
	useEffect(() => {
		fetchClub()
	}, [clubId])

	// Function to fetch club data from the API
	const fetchClub = async () => {
		setLoading(true)
		try {
			const { data } = await axiosInstance.get(`/leagues/clubs/${clubId}`)
			setClub(data)
			// Initialize form data with fetched club data
			setFormData({
				clubName: data.clubName || '',
				clubId: data.clubId || '',
				shortName: data.shortName || '',
				tla: data.tla || '',
				crestUrl: data.crestUrl || '',
				address: data.address || '',
				phone: data.phone || '',
				website: data.website || '',
				email: data.email || '',
				founded: data.founded || '',
				clubColors: data.clubColors || '',
				venue: data.venue || '',
				players: data.players || [],
				lastUpdated: data.lastUpdated ? data.lastUpdated.substring(0, 10) : '',
			})
			setLoading(false)
		} catch (err) {
			setError('Failed to fetch club.')
			setLoading(false)
			toast.error('Failed to fetch club.')
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
		const updatedClub = {
			clubName: formData.clubName,
			clubId: formData.clubId,
			shortName: formData.shortName,
			tla: formData.tla,
			crestUrl: formData.crestUrl,
			address: formData.address,
			phone: formData.phone,
			website: formData.website,
			email: formData.email,
			founded: formData.founded,
			clubColors: formData.clubColors,
			venue: formData.venue,
			// Assuming players are managed separately
			// players: formData.players,
			lastUpdated: formData.lastUpdated,
		}

		try {
			await axiosInstance.put(`/leagues/admin/clubs/${clubId}`, updatedClub)
			toast.success('Club updated successfully.')
			navigate('/leagues/clubs/' + id)
		} catch (err) {
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message)
			} else {
				toast.error('Failed to update club.')
			}
		}
	}

	if (loading) {
		return (
			<div className='club-page dfjccaic'>
				<Loading />
			</div>
		)
	}

	if (error) {
		return <div className='error-message'>{error}</div>
	}

	return (
		<div className='club-page'>
			<h1 className='title'>Edit Club</h1>
			{club && (
				<>
					<form className='club-form' onSubmit={handleSubmit}>
						{/* Club Name */}
						<div className='form-group'>
							<label>Club Name:</label>
							<input
								type='text'
								name='clubName'
								value={formData.clubName}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Club ID */}
						<div className='form-group'>
							<label>Club ID:</label>
							<input
								type='number'
								name='clubId'
								value={formData.clubId}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Short Name */}
						<div className='form-group'>
							<label>Short Name:</label>
							<input
								type='text'
								name='shortName'
								value={formData.shortName}
								onChange={handleChange}
							/>
						</div>

						{/* TLA */}
						<div className='form-group'>
							<label>TLA:</label>
							<input
								type='text'
								name='tla'
								value={formData.tla}
								onChange={handleChange}
							/>
						</div>

						{/* Crest URL */}
						<div className='form-group'>
							<label>Crest URL:</label>
							<input
								type='text'
								name='crestUrl'
								value={formData.crestUrl}
								onChange={handleChange}
							/>
						</div>

						{/* Address */}
						<div className='form-group'>
							<label>Address:</label>
							<input
								type='text'
								name='address'
								value={formData.address}
								onChange={handleChange}
							/>
						</div>

						{/* Phone */}
						<div className='form-group'>
							<label>Phone:</label>
							<input
								type='text'
								name='phone'
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>

						{/* Website */}
						<div className='form-group'>
							<label>Website:</label>
							<input
								type='text'
								name='website'
								value={formData.website}
								onChange={handleChange}
							/>
						</div>

						{/* Email */}
						<div className='form-group'>
							<label>Email:</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
							/>
						</div>

						{/* Founded */}
						<div className='form-group'>
							<label>Founded:</label>
							<input
								type='number'
								name='founded'
								value={formData.founded}
								onChange={handleChange}
							/>
						</div>

						{/* Club Colors */}
						<div className='form-group'>
							<label>Club Colors:</label>
							<input
								type='text'
								name='clubColors'
								value={formData.clubColors}
								onChange={handleChange}
							/>
						</div>

						{/* Venue */}
						<div className='form-group'>
							<label>Venue:</label>
							<input
								type='text'
								name='venue'
								value={formData.venue}
								onChange={handleChange}
							/>
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
					<div className='players-page'>
						{/* Players List */}
						<h2 className='title'>Players</h2>
						{club.players.length > 0 ? (
							<table className='players-table'>
								<thead>
									<tr>
										<th>Player Name</th>
										<th>Position</th>
										<th>Nationality</th>
										<th>Age</th>
									</tr>
								</thead>
								<tbody>
									{club.players.map(player => {
										const today = new Date()
										const birthDate = new Date(player.dateOfBirth) // Convert value to a Date object

										let age = today.getFullYear() - birthDate.getFullYear()
										const monthDiff = today.getMonth() - birthDate.getMonth()

										// Adjust age if the birthday hasn't occurred this year yet
										if (
											monthDiff < 0 ||
											(monthDiff === 0 && today.getDate() < birthDate.getDate())
										) {
											age--
										}
										return (
											<tr key={player._id}>
												<td>
													<Link
														to={`/leagues/players/${id}/${player._id}`}
														className='player-link'
													>
														{player.playerName}
													</Link>
												</td>
												<td>{player.position}</td>
												<td>{player.nationality}</td>
												<td>{age}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						) : (
							<p>No players found for this club.</p>
						)}
					</div>
				</>
			)}
		</div>
	)
}

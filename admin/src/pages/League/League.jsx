// src/pages/League.jsx

import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import './style/league.scss'
import Loading from '../../components/Loading.jsx'
import Select from 'react-select'

export default function League() {
	// Get the league ID from the URL parameters
	const { id } = useParams()

	// State variables
	const [league, setLeague] = useState(null) // Original league data
	const [prizes, setPrizes] = useState(null) // Original league data
	const [boosters, setBoosters] = useState(null) // Original league data
	const [formData, setFormData] = useState({}) // Form data for editing
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState('') // Error message

	const [selectedGameWeekIndex, setSelectedGameWeekIndex] = useState(0) // Selected gameweek
	const [showAllFixtures, setShowAllFixtures] = useState(false) // Toggle to show all fixtures

	const navigate = useNavigate()

	// Fetch league data when component mounts or when ID changes
	useEffect(() => {
		fetchLeague()
	}, [id])

	// Function to fetch league data from the API
	const fetchLeague = async () => {
		setLoading(true)
		try {
			const { data } = await axiosInstance.get(`/leagues/${id}`)
			setLeague(data)
			// Initialize form data with fetched league data
			const boostersData = await fetchBoosters()
			const prizeData = await axiosInstance.get(`/user-leagues/prize/all`)

			setPrizes(prizeData.data.prizes)
			setBoosters(boostersData)
			setFormData({
				...data,
				gameWeeks: data.gameWeeks || [],
			})

			// Set the initial selected gameweek index
			if (data.gameWeeks && data.gameWeeks?.length > 0) {
				setSelectedGameWeekIndex(0)
			}

			setLoading(false)
		} catch (err) {
			setError('Failed to fetch league.')
			setLoading(false)
			toast.error('Failed to fetch league.')
		}
	}

	// Function to fetch league data from the API
	const fetchBoosters = async () => {
		try {
			const { data } = await axiosInstance.get(`/user-leagues/booster/all`)
			return data.boosters
		} catch (err) {
			setError('Failed to fetch boosters.')
			toast.error('Failed to fetch boosters.')
		}
	}

	// Handle input changes in the form
	const handleChange = e => {
		const { name, value, type, checked } = e.target

		// Handle checkbox inputs
		if (type === 'checkbox') {
			setFormData(prevData => ({
				...prevData,
				[name]: checked,
			}))
		} else {
			// Handle other inputs
			setFormData(prevData => ({
				...prevData,
				[name]: value,
			}))
		}
	}

	const handleBoostersChange = selectedOptions => {
		setFormData({
			...formData,
			boosters: selectedOptions
				? selectedOptions.map(option => option.value)
				: [],
		})
	}

	const handlePrizesChange = selectedOptions => {
		setFormData({
			...formData,
			prizes: selectedOptions
				? selectedOptions.map(option => option.value)
				: [],
		})
	}

	// Handle gameweek fixture changes
	const handleFixtureChange = (e, fixtureIndex) => {
		const { name, value } = e.target

		setFormData(prevData => {
			// Create a copy of the gameWeeks array
			const updatedGameWeeks = [...prevData.gameWeeks]

			// Get the selected gameWeek and make a copy
			const selectedGameWeek = {
				...updatedGameWeeks[selectedGameWeekIndex],
				fixturesStandings: [
					...updatedGameWeeks[selectedGameWeekIndex].fixturesStandings,
				],
			}

			// Get the specific fixture and make a copy
			const fixture = {
				...selectedGameWeek.fixturesStandings[fixtureIndex],
			}

			if (name === 'score.fullTime') {
				// Parse the input value to extract home and away scores
				const [homeScoreStr, awayScoreStr] = value.split('-').map(s => s.trim())

				const homeScore = parseInt(homeScoreStr, 10)
					? parseInt(homeScoreStr, 10)
					: 0
				const awayScore = parseInt(awayScoreStr, 10)
					? parseInt(awayScoreStr, 10)
					: 0

				// Update the fullTime scores within the fixture's score object
				fixture.score = {
					...fixture.score, // Keep other properties like winner and duration
					fullTime: {
						home: homeScore,
						away: awayScore,
					},
				}

				// Determine the winner based on the scores
				if (homeScore > awayScore) {
					fixture.score.winner = 'HOME_TEAM'
				} else if (homeScore < awayScore) {
					fixture.score.winner = 'AWAY_TEAM'
				} else {
					fixture.score.winner = 'DRAW'
				}
			} else if (name.startsWith('homeTeam') || name.startsWith('awayTeam')) {
				// Handle team change
				const [teamKey, fieldName] = name.split('.') // 'homeTeam' or 'awayTeam'

				// 'value' is the '_id' of the club to change to
				const clubId = value

				// Find the club in prevData.clubs
				const club = prevData.clubs.find(club => club._id === clubId)

				if (club) {
					// Map club data to the team object fields
					const updatedTeam = {
						id: club.clubId, // Map 'clubId' to 'id'
						name: club.clubName, // Map 'clubName' to 'name'
						shortName: club.shortName,
						tla: club.tla,
						crest: club.crestUrl,
					}

					// Update the fixture's homeTeam or awayTeam
					fixture[teamKey] = updatedTeam
				} else {
					console.error(`Club with _id ${clubId} not found`)
				}
			} else {
				// For other inputs, update the fixture directly
				fixture[name] = value
			}

			// Update the fixturesStandings array with the updated fixture
			selectedGameWeek.fixturesStandings[fixtureIndex] = fixture

			// Update the gameWeeks array with the updated gameWeek
			updatedGameWeeks[selectedGameWeekIndex] = selectedGameWeek

			// Return the updated formData
			return {
				...prevData,
				gameWeeks: updatedGameWeeks,
			}
		})
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault()
		// Prepare the data to be sent to the server
		const updatedLeague = {
			...formData,
			country: {
				name: formData.countryName,
				code: formData.countryCode,
			},
			apiProvider: {
				name: formData.apiProviderName,
				baseUrl: formData.apiProviderBaseUrl,
				apiKey: formData.apiProviderApiKey,
			},
		}

		try {
			await axiosInstance.put(`/leagues/admin/${id}`, updatedLeague)
			toast.success('League updated successfully.')
			navigate('/leagues')
		} catch (err) {
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message)
			} else {
				toast.error('Failed to update league.')
			}
		}
	}

	// Handle gameweek selection change
	const handleGameWeekChange = e => {
		setSelectedGameWeekIndex(parseInt(e.target.value))
		setShowAllFixtures(false) // Reset to showing one fixture when gameweek changes
	}

	// Toggle showing all fixtures
	const toggleShowAllFixtures = () => {
		setShowAllFixtures(prevState => !prevState)
	}

	if (loading) {
		return (
			<div className='league-page dfjccaic'>
				<Loading />
			</div>
		)
	}

	if (error) {
		return <div className='error-message'>{error}</div>
	}

	// Get the selected gameweek and fixtures
	const selectedGameWeek = formData?.gameWeeks
		? formData?.gameWeeks[selectedGameWeekIndex]
		: null
	const fixtures = selectedGameWeek?.fixturesStandings || []

	// Example teams list for dropdown selection
	const teams = league?.clubs || []

	return (
		<div className='league-page'>
			<h1 className='title'>Edit League</h1>
			{league && (
				<>
					{/* Navigation Links */}
					<div className='navigation-links'>
						<ul>
							<li>
								<Link className='btn' to={`/leagues/users/${id}`}>
									View Users
								</Link>
							</li>
							<li>
								<Link className='btn' to={`/leagues/players/${id}`}>
									View Players
								</Link>
							</li>
							<li>
								<Link className='btn' to={`/leagues/clubs/${id}`}>
									View Clubs
								</Link>
							</li>
						</ul>
					</div>
					<form className='league-form' onSubmit={handleSubmit}>
						{/* League Name */}
						<div className='form-group'>
							<label>League Name:</label>
							<input
								type='text'
								name='leagueName'
								value={formData.leagueName}
								onChange={handleChange}
								required
							/>
						</div>
						{/* League ID */}
						<div className='form-group'>
							<label>League ID:</label>
							<input
								type='text'
								name='leagueId'
								value={formData.leagueId}
								onChange={handleChange}
								required
							/>
						</div>

						{/* League Type */}
						<div className='form-group'>
							<label>League Type:</label>
							<select
								name='leagueType'
								value={formData.leagueType}
								onChange={handleChange}
								required
							>
								<option value=''>Select Type</option>
								<option value='public'>Public</option>
								<option value='private'>Private</option>
								<option value='H2H'>H2H</option>
							</select>
						</div>

						{/* Status */}
						<div className='form-group'>
							<label>Status:</label>
							<select
								name='status'
								value={formData.status}
								onChange={handleChange}
								required
							>
								<option value=''>Select Status</option>
								<option value='active'>Active</option>
								<option value='inactive'>Inactive</option>
								<option value='completed'>Completed</option>
							</select>
						</div>

						{/* Country Name */}
						<div className='form-group'>
							<label>Country Name:</label>
							<input
								type='text'
								name='country.name'
								value={formData.countryName}
								onChange={handleChange}
							/>
						</div>

						{/* Country Code */}
						<div className='form-group'>
							<label>Country Code:</label>
							<input
								type='text'
								name='country.code'
								value={formData.countryCode}
								onChange={handleChange}
							/>
						</div>

						{/* Season */}
						<div className='form-group'>
							<label>Season:</label>
							<input
								type='text'
								name='season'
								value={formData.season}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Transfer Limit */}
						<div className='form-group'>
							<label>Transfer Limit:</label>
							<input
								type='number'
								name='transferLimit'
								value={formData.transferLimit}
								onChange={handleChange}
							/>
						</div>

						{/* Start Date */}
						<div className='form-group'>
							<label>Start Date:</label>
							<input
								type='date'
								name='startDate'
								value={new Date(formData.startDate).toISOString().split('T')[0]}
								onChange={handleChange}
								required
							/>
						</div>

						{/* End Date */}
						<div className='form-group'>
							<label>End Date:</label>
							<input
								type='date'
								name='endDate'
								value={new Date(formData.endDate).toISOString().split('T')[0]}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Timezone */}
						<div className='form-group'>
							<label>Timezone:</label>
							<input
								type='text'
								name='timezone'
								value={formData.timezone}
								onChange={handleChange}
							/>
						</div>

						{/* Description */}
						<div className='form-group'>
							<label>Description:</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleChange}
							/>
						</div>

						{/* Price */}
						<div className='form-group'>
							<label>Price:</label>
							<input
								type='number'
								name='price'
								value={formData.price}
								onChange={handleChange}
								required
							/>
						</div>

						{/* Entry Deadline */}
						<div className='form-group'>
							<label>Entry Deadline:</label>
							<input
								type='date'
								name='entryDeadline'
								value={
									new Date(formData.entryDeadline).toISOString().split('T')[0]
								}
								onChange={handleChange}
								required
							/>
						</div>

						{/* API Provider Name */}
						<div className='form-group'>
							<label>API Provider Name:</label>
							<input
								type='text'
								name='apiProvider.name'
								value={formData.apiProviderName}
								onChange={handleChange}
							/>
						</div>

						{/* API Provider Base URL */}
						<div className='form-group'>
							<label>API Provider Base URL:</label>
							<input
								type='text'
								name='apiProvider.baseUrl'
								value={formData.apiProviderBaseUrl}
								onChange={handleChange}
							/>
						</div>

						{/* API Provider API Key */}
						<div className='form-group'>
							<label>API Provider API Key:</label>
							<input
								type='text'
								name='apiProvider.apiKey'
								value={formData.apiProviderApiKey}
								onChange={handleChange}
							/>
						</div>

						{/* Last Sync Time */}
						<div className='form-group'>
							<label>Last Sync Time:</label>
							<input
								type='date'
								name='lastSyncTime'
								value={
									new Date(formData.lastSyncTime).toISOString().split('T')[0]
								}
								onChange={handleChange}
							/>
						</div>

						{/* Sync Frequency */}
						<div className='form-group'>
							<label>Sync Frequency (minutes):</label>
							<input
								type='number'
								name='syncFrequency'
								value={formData.syncFrequency}
								onChange={handleChange}
							/>
						</div>

						{/* Prizes */}
						<div className='form-group'>
							<label>Prizes:</label>

							<Select
								isMulti
								name='applicableLeagues'
								value={prizes
									?.filter(prize => formData.prizes.includes(prize._id))
									?.map(prize => ({
										value: prize._id,
										label: prize.title,
									}))}
								options={prizes?.map(prize => ({
									value: prize._id,
									label: prize.title,
								}))}
								onChange={handlePrizesChange}
								className='basic-multi-select'
								classNamePrefix='select'
							/>
						</div>

						{/* Image Link */}
						<div className='form-group'>
							<label>Image Link:</label>
							<input
								type='text'
								name='imageLink'
								value={formData.imageLink}
								onChange={handleChange}
							/>
						</div>

						{/* Boosters */}
						<div className='form-group'>
							<label>Boosters:</label>

							<Select
								isMulti
								name='applicableLeagues'
								value={boosters
									?.filter(booster => formData.boosters.includes(booster._id))
									?.map(booster => ({
										value: booster._id,
										label: booster.name,
									}))}
								options={boosters?.map(booster => ({
									value: booster._id,
									label: booster.name,
								}))}
								onChange={handleBoostersChange}
								className='basic-multi-select'
								classNamePrefix='select'
							/>
						</div>

						{/* Closed */}
						<div className='form-group'>
							<label>Closed:</label>
							<input
								type='checkbox'
								name='closed'
								checked={formData.closed}
								onChange={handleChange}
							/>
						</div>

						{/* Fixtures Section */}
						{formData.gameWeeks && formData.gameWeeks?.length > 0 && (
							<div className='fixtures-section'>
								<h2>Fixtures</h2>
								{/* Gameweek Selector */}
								<div className='gameweek-selector'>
									<label>Select Gameweek:</label>
									<select
										value={selectedGameWeekIndex}
										onChange={handleGameWeekChange}
									>
										{formData.gameWeeks.map((gw, index) => (
											<option key={gw._id || index} value={index}>
												Gameweek {index + 1}
											</option>
										))}
									</select>
								</div>
								{/* Fixtures List */}
								{fixtures.length > 0 ? (
									<div className='fixtures-list'>
										{fixtures
											.slice(0, showAllFixtures ? fixtures.length : 1)
											.map((fixture, fixtureIndex) => (
												<div key={fixture.id} className='fixture-item'>
													<div>
														<label>Date:</label>
														<input
															type='datetime-local'
															name='utcDate'
															value={new Date(fixture.utcDate)
																.toISOString()
																.slice(0, 16)}
															onChange={e =>
																handleFixtureChange(e, fixtureIndex)
															}
														/>
													</div>
													<div className='two-competitors'>
														<div className='competitors first-competitor'>
															<img
																src={fixture.homeTeam.crest}
																alt={`${fixture.homeTeam.name} crest`}
															/>
															<select
																name='homeTeam.name'
																value={
																	teams.find(
																		team => team.clubId === fixture.homeTeam.id
																	)?._id
																}
																onChange={e =>
																	handleFixtureChange(e, fixtureIndex)
																}
															>
																<option value=''>Select Team</option>
																{teams.map(team => (
																	<option key={team._id} value={team._id}>
																		{team.clubName}
																	</option>
																))}
															</select>
														</div>
														<h4>VS</h4>
														<div className='competitors second-competitor'>
															<select
																className='right-club-select'
																name='awayTeam.name'
																value={
																	teams.find(
																		team => team.clubId === fixture.awayTeam.id
																	)?._id
																}
																onChange={e =>
																	handleFixtureChange(e, fixtureIndex)
																}
															>
																<option value=''>Select Team</option>
																{teams.map(team => (
																	<option key={team._id} value={team._id}>
																		{team.clubName}
																	</option>
																))}
															</select>
															<img
																src={fixture.awayTeam.crest}
																alt={`${fixture.awayTeam.name} crest`}
															/>
														</div>
													</div>
													<div className='score'>
														<label>Score:</label>
														<input
															type='text'
															name='score.fullTime'
															value={`${fixture.score.fullTime.home} - ${fixture.score.fullTime.away}`}
															onChange={e =>
																handleFixtureChange(e, fixtureIndex)
															}
														/>
													</div>
													<div className='status'>
														<label>Status:</label>
														<select
															name='status'
															value={fixture.status}
															onChange={e =>
																handleFixtureChange(e, fixtureIndex)
															}
														>
															<option value='SCHEDULED'>Scheduled</option>
															<option value='IN_PLAY'>In Play</option>
															<option value='FINISHED'>Finished</option>
															<option value='POSTPONED'>Postponed</option>
														</select>
													</div>
												</div>
											))}
										{/* Show More / Show Less Button */}
										{fixtures.length > 1 && (
											<button
												onClick={toggleShowAllFixtures}
												className='btn'
												type='button'
											>
												{showAllFixtures ? 'Show Less' : 'Show More'}
											</button>
										)}
									</div>
								) : (
									<p>No fixtures available for this gameweek.</p>
								)}
							</div>
						)}

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

import React, { useState, useEffect } from 'react'
import Select from 'react-select' // Select component
import axiosInstance from '../../axiosInstance' // Axios instance for API calls

export default function GameWeekInfo({
	formData,
	setFormData,
	setError,
	toast,
	leagueId,
}) {
	const MAX_GAMEWEEKS = 38 // Maximum number of gameweeks
	const [selectedGameWeekIndex, setSelectedGameWeekIndex] = useState(0)
	const [playerOptions, setPlayerOptions] = useState([])

	// State to store league boosters
	const [leagueBoosters, setLeagueBoosters] = useState([])

	// useEffect to fetch UserLeague data when component mounts
	useEffect(() => {
		fetchLeagueBoostersAndPlayers() // Fetch UserLeague data
	}, [])

	// Function to fetch UserLeague data
	const fetchLeagueBoostersAndPlayers = async () => {
		try {
			const boosters = await getLeagueBoosters()
			let players
			if (leagueId) {
				players = await fetchPlayers()
			}

			setPlayerOptions(players)
			setLeagueBoosters(boosters)
		} catch (err) {
			console.log(err)
			setError('Failed to fetch UserLeague data.') // Set error state if fetching fails
			toast.error('Failed to fetch UserLeague data.') // Display error message
		}
	}
	// Function to fetch UserLeague data
	const getLeagueBoosters = async () => {
		try {
			const boosters = await axiosInstance.get('/leagues/boosters/' + leagueId)
			return boosters.data
		} catch (err) {
			console.log(err)
			setError('Failed to fetch league Boosters data.') // Set error state if fetching fails
			toast.error('Failed to fetch league Boosters data.') // Display error message
		}
	}

	const fetchPlayers = async () => {
		try {
			const response = await axiosInstance.get(
				`/leagues/players/all-names/${leagueId}`
			)

			const options = response.data.players.map(player => ({
				value: player._id,
				label: player.playerName,
			}))
			return options
		} catch (error) {
			console.error('Error fetching players:', error)
		}
	}

	// Ensure gameWeeks array exists
	if (!formData.gameWeeks) {
		formData.gameWeeks = []
	}

	// Check if selected gameweek exists, else create a default one
	const existingGameWeek = formData.gameWeeks[selectedGameWeekIndex]
	const defaultGameWeek = {
		gameweekNumber: selectedGameWeekIndex + 1,
		pointsScored: '',
		gameweekRank: '',
		scoreMultiplier: '',
		benchPoints: '',
		transfersMade: 0,
		boostersUsed: [],
		headToHead: {},
		team: {
			players: [],
			transferHistory: [],
			captain: '',
			viceCaptain: '',
			benchPlayers: [],
			transferBudget: '',
		},
	}

	const selectedGameWeek = existingGameWeek || defaultGameWeek

	const handleGameWeekChange = e => {
		setSelectedGameWeekIndex(Number(e.target.value))
	}

	const setNestedValue = (obj, path, value) => {
		const keys = path.split('.')
		let temp = obj
		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i]
			if (!temp[key]) temp[key] = {}
			temp = temp[key]
		}
		temp[keys[keys.length - 1]] = value
	}

	const handleChange = e => {
		const { name, value } = e.target
		const updatedGameWeeks = [...formData.gameWeeks]
		const updatedGameWeek = { ...selectedGameWeek }

		setNestedValue(updatedGameWeek, name, value)

		updatedGameWeeks[selectedGameWeekIndex] = updatedGameWeek
		setFormData({ ...formData, gameWeeks: updatedGameWeeks })
	}

	const handlePlayerChange = (path, index, selectedOption) => {
		const updatedGameWeeks = [...formData.gameWeeks]
		const updatedGameWeek = { ...selectedGameWeek }
		let temp = updatedGameWeek

		// Navigate to the correct array (players or benchPlayers)
		for (let i = 0; i < path.length - 1; i++) {
			temp = temp[path[i]]
		}

		// Update the specific player ID in the array
		temp[path[path.length - 1]][index] = selectedOption.value

		updatedGameWeeks[selectedGameWeekIndex] = updatedGameWeek
		setFormData({ ...formData, gameWeeks: updatedGameWeeks })
	}

	const addItemToArray = (path, newItem) => {
		const updatedGameWeeks = [...formData.gameWeeks]
		const updatedGameWeek = { ...selectedGameWeek }
		let temp = updatedGameWeek

		for (let i = 0; i < path.length; i++) {
			if (!temp[path[i]]) temp[path[i]] = []
			if (i === path.length - 1) {
				temp[path[i]].push(newItem)
			} else {
				temp = temp[path[i]]
			}
		}

		updatedGameWeeks[selectedGameWeekIndex] = updatedGameWeek
		setFormData({ ...formData, gameWeeks: updatedGameWeeks })
	}

	const removeItemFromArray = (path, index) => {
		const updatedGameWeeks = [...formData.gameWeeks]
		const updatedGameWeek = { ...selectedGameWeek }
		let temp = updatedGameWeek

		for (let i = 0; i < path.length - 1; i++) {
			temp = temp[path[i]]
		}
		temp[path[path.length - 1]].splice(index, 1)

		updatedGameWeeks[selectedGameWeekIndex] = updatedGameWeek
		setFormData({ ...formData, gameWeeks: updatedGameWeeks })
	}

	return (
		<div className='gameweek-info'>
			<div className='gameweek-selector'>
				<select value={selectedGameWeekIndex} onChange={handleGameWeekChange}>
					{Array.from({ length: MAX_GAMEWEEKS }, (_, index) => (
						<option key={index} value={index}>
							Gameweek {index + 1}
						</option>
					))}
				</select>
			</div>

			<div className='gameweek-details'>
				<h2>Gameweek {selectedGameWeek.gameweekNumber}</h2>

				{/* Basic Fields */}
				<div className='basic-fields'>
					{[
						'gameweekNumber',
						'pointsScored',
						'gameweekRank',
						'scoreMultiplier',
						'benchPoints',
						'transfersMade',
					].map(field => (
						<div key={field} className='form-group '>
							<label>{field.replace(/([A-Z])/g, ' $1')}:</label>
							<input
								type='number'
								name={field}
								value={selectedGameWeek[field] || ''}
								onChange={handleChange}
							/>
						</div>
					))}
				</div>

				{/* Boosters */}
				<div className='form-group boosters-used'>
					<label>Boosters Used</label>

					<Select
						isMulti
						name='allBoosters'
						value={leagueBoosters
							?.filter(booster =>
								selectedGameWeek.boostersUsed.includes(booster._id)
							)
							?.map(booster => ({
								value: booster._id,
								label: booster.name,
							}))}
						options={leagueBoosters?.map(booster => ({
							value: booster._id,
							label: booster.name,
						}))}
						onChange={selectedOptions => {
							const updatedGameWeeks = [...formData.gameWeeks]
							const updatedGameWeek = { ...selectedGameWeek }

							// Extract booster IDs from selected options
							updatedGameWeek.boostersUsed = selectedOptions.map(
								option => option.value
							)

							// Update the specific gameweek in the gameWeeks array
							updatedGameWeeks[selectedGameWeekIndex] = updatedGameWeek

							// Update the form data
							setFormData({
								...formData,
								gameWeeks: updatedGameWeeks,
							})
						}}
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Head to Head */}
				<div className='form-group head-to-head'>
					<h3>Head To Head Matchup</h3>
					{['opponentId', 'opponentPoints', 'result', 'pointsDifference'].map(
						field => (
							<div className='h2h-input' key={field}>
								<label>{field.replace(/([A-Z])/g, ' $1')}:</label>
								<input
									type={field.includes('Points') ? 'number' : 'text'}
									name={`headToHead.${field}`}
									value={selectedGameWeek.headToHead?.[field] || ''}
									onChange={handleChange}
								/>
							</div>
						)
					)}
				</div>
				{/* Team Details */}
				<div className='team-details'>
					<h3>Team Details</h3>

					{/* Captain */}
					<div className='form-group'>
						<label>Captain:</label>
						<Select
							options={playerOptions}
							value={playerOptions.find(
								option => option.value === selectedGameWeek.team.captain
							)}
							onChange={selectedOption =>
								handleChange({
									target: {
										name: 'team.captain',
										value: selectedOption.value,
									},
								})
							}
							isMulti={false}
							placeholder='Select Captain'
						/>
					</div>

					{/* Vice-Captain */}
					<div className='form-group'>
						<label>Vice-Captain:</label>
						<Select
							options={playerOptions}
							value={playerOptions.find(
								option => option.value === selectedGameWeek.team.viceCaptain
							)}
							onChange={selectedOption =>
								handleChange({
									target: {
										name: 'team.viceCaptain',
										value: selectedOption.value,
									},
								})
							}
							isMulti={false}
							placeholder='Select Vice-Captain'
						/>
					</div>

					{/* Transfer Budget */}
					<div className='form-group'>
						<label>Transfer Budget:</label>
						<input
							type='number'
							name='team.transferBudget'
							value={selectedGameWeek.team.transferBudget || ''}
							onChange={handleChange}
						/>
					</div>

					{/* Players */}
					<div className='players-list'>
						<h4>Players</h4>
						{selectedGameWeek.team.players &&
						selectedGameWeek.team.players.length > 0 ? (
							selectedGameWeek.team.players.map((playerId, index) => (
								<div key={index} className='form-group player-group'>
									<Select
										options={playerOptions}
										value={playerOptions.find(
											option => option.value === playerId
										)}
										className='player-select'
										onChange={selectedOption =>
											handlePlayerChange(
												['team', 'players'],
												index,
												selectedOption
											)
										}
										isMulti={false}
										placeholder='Select player'
									/>
									<button
										type='button'
										className='btn'
										onClick={() =>
											removeItemFromArray(['team', 'players'], index)
										}
									>
										Remove
									</button>
								</div>
							))
						) : (
							<p>No players</p>
						)}
						<button
							type='button'
							className='btn player-btn'
							onClick={() => addItemToArray(['team', 'players'], '')}
						>
							Add Player
						</button>
					</div>

					{/* Bench Players */}
					<div className='bench-players-list'>
						<h4>Bench Players</h4>
						{selectedGameWeek.team.benchPlayers &&
						selectedGameWeek.team.benchPlayers.length > 0 ? (
							selectedGameWeek.team.benchPlayers.map((playerId, index) => (
								<div key={index} className='form-group player-group'>
									<Select
										options={playerOptions}
										className='player-select'
										value={playerOptions.find(
											option => option.value === playerId
										)}
										onChange={selectedOption =>
											handlePlayerChange(
												['team', 'benchPlayers'],
												index,
												selectedOption
											)
										}
										isMulti={false}
										placeholder='Select player'
									/>
									<button
										type='button'
										className='btn'
										onClick={() =>
											removeItemFromArray(['team', 'benchPlayers'], index)
										}
									>
										Remove
									</button>
								</div>
							))
						) : (
							<p>No bench players</p>
						)}
						<button
							type='button'
							className='btn player-btn'
							onClick={() => addItemToArray(['team', 'benchPlayers'], '')}
						>
							Add Bench Player
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

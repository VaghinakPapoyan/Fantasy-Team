// Prize.js
// Import necessary dependencies
import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'
import './style/prize.scss'
import Loader from '../../components/Loading'

export default function Prize() {
	const { id } = useParams() // Extract the 'id' parameter from the URL using useParams()

	// State to store prize data and other necessary data
	const [prizeData, setPrizeData] = useState({
		title: '',
		description: '',
		imageUrl: '',
		condition: '',
		reward: '',
		isActive: true,
		isDistributed: false,
		rankRange: {
			from: '',
			to: '',
		},
		leagues: [],
		players: [],
	})
	const [leagues, setLeagues] = useState([]) // State to store list of leagues
	const [players, setPlayers] = useState([]) // State to store list of players
	const [loading, setLoading] = useState(false) // State to indicate loading while fetching prize data
	const [error, setError] = useState('') // State to store error message if any error occurs
	const [loadingData, setLoadingData] = useState(true) // State to indicate if data is being fetched initially

	const navigate = useNavigate() // Hook to navigate programmatically

	// useEffect to fetch leagues and players initially when the component mounts
	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([fetchLeagues(), fetchPlayers()]) // Fetch leagues and players simultaneously
			setLoadingData(false) // Set loadingData to false after fetching
		}
		fetchData() // Call the async function to fetch data
	}, [])

	// useEffect to fetch prize data if 'id' is present
	useEffect(() => {
		if (id) {
			fetchPrize() // Fetch the prize details if an ID is provided
		}
	}, [id])

	// Function to fetch all leagues
	const fetchLeagues = async () => {
		try {
			const { data } = await axiosInstance.get('/leagues/all') // Fetch all leagues from the server
			setLeagues(data) // Set the fetched leagues to state
		} catch (err) {
			toast.error('Failed to fetch leagues.') // Display error message if fetching fails
		}
	}

	// Function to fetch all players
	const fetchPlayers = async () => {
		try {
			const { data } = await axiosInstance.get('/users/admin/all') // Fetch all players from the server

			setPlayers(data.users) // Set the fetched players to state
		} catch (err) {
			toast.error('Failed to fetch players.') // Display error message if fetching fails
		}
	}

	// Function to fetch prize details based on ID
	const fetchPrize = async () => {
		setLoading(true) // Set loading state to true while fetching
		try {
			const { data } = await axiosInstance.get(`/user-leagues/prize/${id}`) // Fetch prize data using the ID
			setPrizeData({
				title: data.prize.title || '',
				description: data.prize.description || '',
				imageUrl: data.prize.imageUrl || '',
				condition: data.prize.condition || '',
				reward: data.prize.reward || '',
				isActive: data.prize.isActive || false,
				isDistributed: data.prize.isDistributed || false,
				rankRange: data.prize.rankRange || { from: '', to: '' },
				leagues: data.prize.leagues || [],
				players: data.prize.players || [],
			})
			setLoading(false) // Set loading state to false after fetching
		} catch (err) {
			setError('Failed to fetch prize.') // Set error state if fetching fails
			setLoading(false) // Set loading state to false after error
			toast.error('Failed to fetch prize.') // Display error message
		}
	}

	// Generic change handler for form inputs
	const handleChange = e => {
		const { name, value } = e.target // Extract name and value from the input field
		setPrizeData(prevData => ({
			...prevData, // Keep previous state
			[name]: value, // Update the specific field in prizeData
		}))
	}

	// Change handler for rankRange inputs
	const handleRankRangeChange = e => {
		const { name, value } = e.target
		setPrizeData(prevData => ({
			...prevData,
			rankRange: {
				...prevData.rankRange,
				[name]: value,
			},
		}))
	}

	// Change handler for isActive and isDistributed checkboxes
	const handleCheckboxChange = e => {
		const { name, checked } = e.target
		setPrizeData(prevData => ({
			...prevData,
			[name]: checked,
		}))
	}

	// Change handler for multi-select dropdown using react-select for players
	const handlePlayersChange = selectedOptions => {
		const selectedPlayers = selectedOptions
			? selectedOptions.map(option => option.value)
			: [] // Extract player IDs from selected options
		setPrizeData(prevData => ({
			...prevData, // Keep previous state
			players: selectedPlayers, // Update players array in prizeData
		}))
	}

	// Change handler for multi-select dropdown for leagues using react-select
	const handleLeaguesChange = selectedOptions => {
		const selectedLeagues = selectedOptions
			? selectedOptions.map(option => option.value)
			: [] // Extract league IDs from selected options
		setPrizeData(prevData => ({
			...prevData, // Keep previous state
			leagues: selectedLeagues, // Update leagues array in prizeData
		}))
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault() // Prevent default form submission behavior
		try {
			const payload = {
				...prizeData,
				rankRange: {
					from: Number(prizeData.rankRange.from),
					to: Number(prizeData.rankRange.to),
				},
			}
			if (id) {
				// If ID exists, update existing prize
				await axiosInstance.put(`/user-leagues/admin/prize/${id}`, payload)
				toast.success('Prize updated successfully.') // Display success message
			} else {
				// Otherwise, create a new prize
				await axiosInstance.post('/user-leagues/admin/prize', payload)
				toast.success('Prize created successfully.') // Display success message
			}
			navigate('/prizes') // Navigate to prizes page after successful submission
		} catch (err) {
			// Handle error during submission
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message) // Display specific error message from server
			} else {
				toast.error('Failed to submit prize.') // Display generic error message
			}
		}
	}

	// Display loading state if data is still being fetched
	if (loading || loadingData) {
		return (
			<div className='dfjccaic prize-form-page'>
				<Loader />
			</div>
		)
	}

	// Display error message if error state is set
	if (error) {
		return <div className='error-message'>{error}</div>
	}

	return (
		<div className='prize-form-page'>
			<h1 className='title'>{id ? 'Edit Prize' : 'Create Prize'}</h1>
			<form className='prize-form' onSubmit={handleSubmit}>
				{/* Prize Title */}
				<div className='form-group'>
					<label>Title:</label>
					<input
						type='text'
						name='title'
						value={prizeData.title}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Description */}
				<div className='form-group'>
					<label>Description:</label>
					<textarea
						name='description'
						value={prizeData.description}
						onChange={handleChange}
					/>
				</div>

				{/* Image URL */}
				<div className='form-group'>
					<label>Image URL:</label>
					<input
						type='text'
						name='imageUrl'
						value={prizeData.imageUrl}
						onChange={handleChange}
					/>
				</div>

				{/* Condition */}
				<div className='form-group'>
					<label>Condition:</label>
					<textarea
						name='condition'
						value={prizeData.condition}
						onChange={handleChange}
					/>
				</div>

				{/* Reward */}
				<div className='form-group'>
					<label>Reward:</label>
					<input
						type='text'
						name='reward'
						value={prizeData.reward}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Is Active */}
				<div className='form-group checkbox-group'>
					<label>
						<input
							type='checkbox'
							name='isActive'
							checked={prizeData.isActive}
							onChange={handleCheckboxChange}
						/>
						Is Active
					</label>
				</div>

				{/* Is Distributed */}
				<div className='form-group checkbox-group'>
					<label>
						<input
							type='checkbox'
							name='isDistributed'
							checked={prizeData.isDistributed}
							onChange={handleCheckboxChange}
						/>
						Is Distributed
					</label>
				</div>

				{/* Rank Range */}
				<div className='form-group'>
					<label>Rank Range:</label>
					<div className='rank-range-inputs'>
						<input
							type='number'
							name='from'
							placeholder='From'
							value={prizeData.rankRange.from}
							onChange={handleRankRangeChange}
							min='1'
							required
						/>
						<input
							type='number'
							name='to'
							placeholder='To'
							value={prizeData.rankRange.to}
							onChange={handleRankRangeChange}
							min='1'
							required
						/>
					</div>
				</div>

				{/* Leagues */}
				<div className='form-group'>
					<label>Leagues:</label>
					<Select
						isMulti
						name='leagues'
						value={leagues
							.filter(league => prizeData.leagues.includes(league._id))
							.map(league => ({
								value: league._id,
								label: league.leagueName,
							}))}
						options={leagues.map(league => ({
							value: league._id,
							label: league.leagueName,
						}))}
						onChange={handleLeaguesChange} // Update prizeData.leagues on selection change
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Players */}
				<div className='form-group'>
					<label>Players:</label>
					<Select
						isMulti
						name='players'
						value={players
							.filter(player => prizeData.players.includes(player._id))
							.map(player => ({
								value: player._id,
								label: `${player.firstName ? player.firstName : ''} ${
									player.lastName ? player.lastName : ''
								} (${player.email})`,
							}))} // Convert selected player IDs to react-select format
						options={players.map(player => ({
							value: player._id,
							label: `${player.firstName ? player.firstName : ''} ${
								player.lastName ? player.lastName : ''
							} (${player.email})`,
						}))} // Provide all players as options in react-select format
						onChange={handlePlayersChange} // Update prizeData.players on selection change
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Save Button */}
				<button type='submit' className='btn btn-save'>
					{id ? 'Update Prize' : 'Create Prize'}
				</button>
			</form>
		</div>
	)
}

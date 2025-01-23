// Booster.jsx
// Import necessary dependencies
import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'
import './style/booster.scss'
import Loader from '../../components/Loading'

export default function Booster() {
	const { id } = useParams() // Extract 'id' from the URL parameters
	const navigate = useNavigate() // Hook to navigate programmatically

	// State to store booster data and related entities
	const [boosterData, setBoosterData] = useState({
		name: '',
		description: '',
		iconUrl: '',
		cost: '',
		duration: '',
		isActive: true,
		usedCount: 0,
		usageLimit: '',
		leagues: [],
	})
	const [leagues, setLeagues] = useState([]) // Store available leagues
	const [loading, setLoading] = useState(false) // State to show loading spinner during actions
	const [error, setError] = useState('') // State for error messages
	const [loadingData, setLoadingData] = useState(true) // State to indicate initial data fetching

	// useEffect to fetch leagues and booster data on component mount
	useEffect(() => {
		const fetchInitialData = async () => {
			await fetchLeagues()
			if (id) {
				await fetchBooster()
			}
			setLoadingData(false)
		}
		fetchInitialData()
	}, [id])

	// Fetch all leagues
	const fetchLeagues = async () => {
		try {
			const { data } = await axiosInstance.get('/leagues/all')
			setLeagues(data)
		} catch (err) {
			toast.error('Failed to fetch leagues.')
		}
	}

	// Fetch booster details if editing an existing booster
	const fetchBooster = async () => {
		setLoading(true)
		try {
			const { data } = await axiosInstance.get(`/user-leagues/booster/${id}`)
			setBoosterData({
				name: data.booster.name || '',
				description: data.booster.description || '',
				iconUrl: data.booster.iconUrl || '',
				cost: data.booster.cost || '',
				duration: data.booster.duration || '',
				isActive: data.booster.isActive || false,
				leagues: data.booster.leagues || [],
				usedCount: data.booster.usedCount,
				usageLimit: data.booster.usageLimit,
			})
			setLoading(false)
		} catch (err) {
			setError('Failed to fetch booster.')
			setLoading(false)
			toast.error('Failed to fetch booster.')
		}
	}

	// Generic handler for input changes
	const handleChange = e => {
		const { name, value } = e.target
		setBoosterData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	// Checkbox handler for isActive
	const handleCheckboxChange = e => {
		const { name, checked } = e.target
		setBoosterData(prevData => ({
			...prevData,
			[name]: checked,
		}))
	}

	// Multi-select dropdown handler for leagues
	const handleLeaguesChange = selectedOptions => {
		const selectedLeagues = selectedOptions
			? selectedOptions.map(option => option.value)
			: []
		setBoosterData(prevData => ({
			...prevData,
			leagues: selectedLeagues,
		}))
	}

	// Form submission handler
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			const payload = { ...boosterData }
			if (id) {
				// Update existing booster
				await axiosInstance.put(`/user-leagues/admin/booster/${id}`, payload)
				toast.success('Booster updated successfully.')
			} else {
				// Create a new booster
				await axiosInstance.post('/user-leagues/admin/booster', payload)
				toast.success('Booster created successfully.')
			}
			navigate('/boosters') // Navigate back to boosters list
		} catch (err) {
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message)
			} else {
				toast.error('Failed to submit booster.')
			}
		}
	}

	// Display loading indicator while fetching data
	if (loading || loadingData) {
		return (
			<div className='dfjccaic booster-form-page'>
				<Loader />
			</div>
		)
	}

	// Display error message if error state is set
	if (error) {
		return <div className='error-message'>{error}</div>
	}

	// Render the form
	return (
		<div className='booster-form-page'>
			<h1 className='title'>{id ? 'Edit Booster' : 'Create Booster'}</h1>
			<form className='booster-form' onSubmit={handleSubmit}>
				{/* Booster Name */}
				<div className='form-group'>
					<label>Name:</label>
					<input
						type='text'
						name='name'
						value={boosterData.name}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Description */}
				<div className='form-group'>
					<label>Description:</label>
					<textarea
						name='description'
						value={boosterData.description}
						onChange={handleChange}
					/>
				</div>

				{/* Icon URL */}
				<div className='form-group'>
					<label>Icon URL:</label>
					<input
						type='text'
						name='iconUrl'
						value={boosterData.iconUrl}
						onChange={handleChange}
					/>
				</div>

				{/* Cost */}
				<div className='form-group'>
					<label>Cost:</label>
					<input
						type='text'
						name='cost'
						value={boosterData.cost}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Duration */}
				<div className='form-group'>
					<label>Duration:</label>
					<input
						type='text'
						name='duration'
						value={boosterData.duration}
						onChange={handleChange}
					/>
				</div>

				{/* Is Active */}
				<div className='form-group checkbox-group'>
					<label>
						<input
							type='checkbox'
							name='isActive'
							checked={boosterData.isActive}
							onChange={handleCheckboxChange}
						/>
						Is Active
					</label>
				</div>

				{/* Applicable Leagues */}
				<div className='form-group'>
					<label>Applicable Leagues:</label>
					<Select
						isMulti
						name='leagues'
						value={leagues
							.filter(league => boosterData.leagues.includes(league._id))
							.map(league => ({
								value: league._id,
								label: league.leagueName,
							}))}
						options={leagues.map(league => ({
							value: league._id,
							label: league.leagueName,
						}))}
						onChange={handleLeaguesChange}
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Used Count */}
				<div className='form-group'>
					<label htmlFor='usedCount'>Used Count:</label>
					<input
						type='number'
						id='usedCount'
						name='usedCount'
						value={boosterData.usedCount || ''}
						onChange={handleChange}
					/>
				</div>

				{/* Usage Limit */}
				<div className='form-group'>
					<label htmlFor='usageLimit'>Usage Limit:</label>
					<input
						type='number'
						id='usageLimit'
						name='usageLimit'
						value={boosterData.usageLimit || ''}
						onChange={handleChange}
					/>
				</div>
				{/* Save Button */}
				<button type='submit' className='btn btn-save'>
					{id ? 'Update Booster' : 'Create Booster'}
				</button>
			</form>
		</div>
	)
}

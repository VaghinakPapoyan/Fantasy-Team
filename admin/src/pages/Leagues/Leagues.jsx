// src/pages/Leagues.jsx

import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance' // Import the axios instance
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // Import Toastify CSS
import './style/leagues.scss'
import Loading from '../../components/Loading.jsx'

export default function Leagues() {
	// State variables
	const [leagues, setLeagues] = useState([]) // List of leagues
	const [loading, setLoading] = useState(false) // Loading state for fetching leagues
	const [syncing, setSyncing] = useState(false) // Loading state for syncing data
	const [error, setError] = useState('') // Error message

	// Fetch leagues when component mounts
	useEffect(() => {
		fetchLeagues()
	}, [])

	// Function to fetch leagues from the API
	const fetchLeagues = async () => {
		setLoading(true) // Show loading spinner
		try {
			const { data } = await axiosInstance.get('/leagues/all')
			setLeagues(data)
			setLoading(false) // Hide loading spinner
		} catch (err) {
			setError('Failed to fetch leagues.')
			setLoading(false)
			toast.error('Failed to fetch leagues.')
		}
	}

	// Function to sync league data
	const handleSync = async () => {
		setSyncing(true) // Show loading state while syncing
		try {
			// Make a request to the backend API to trigger sync
			await axiosInstance.post('/leagues/admin/sync')

			// If sync is successful, show success toast
			toast.success('League data synced successfully!')
			// Refresh the leagues list after syncing
			fetchLeagues()
		} catch (error) {
			// Show error toast in case of failure
			toast.error('Error syncing league data. Please try again later.')
			console.error('Sync error:', error)
		} finally {
			setSyncing(false) // Remove loading state
		}
	}

	// Handle delete league
	const handleDelete = async id => {
		if (window.confirm('Are you sure you want to delete this league?')) {
			try {
				await axiosInstance.delete(`/leagues/admin/${id}`)
				toast.success('League deleted successfully.')
				// Remove the deleted league from the state
				setLeagues(leagues.filter(league => league._id !== id))
			} catch (err) {
				toast.error('Failed to delete league.')
			}
		}
	}

	if (loading) {
		// Show loading spinner while fetching leagues
		return (
			<div className='leagues-page dfjccaic'>
				<Loading />
			</div>
		)
	}

	if (error) {
		// Display error message if fetching leagues fails
		return <div className='error-message'>{error}</div>
	}

	return (
		<div className='leagues-page'>
			<h1 className='title'>League Management</h1>

			{/* Sync button */}
			<button onClick={handleSync} disabled={syncing} className='btn btn-sync'>
				{syncing ? 'Syncing...' : 'Sync League Data'}
			</button>

			{leagues.length > 0 ? (
				<table className='leagues-table'>
					<thead>
						<tr>
							<th>Logo</th>
							<th>Name</th>
							<th>Type</th>
							<th>Status</th>
							<th>Season</th>
							<th>Start Date</th>
							<th>End Date</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{leagues.map(league => (
							<tr key={league._id}>
								<td>
									<img src={league.imageLink} alt='league' />
								</td>
								<td>{league.leagueName}</td>
								<td>{league.leagueType}</td>
								<td>{league.status}</td>
								<td>{league.season}</td>
								<td>
									{league.startDate
										? new Date(league.startDate).toLocaleDateString()
										: 'N/A'}
								</td>
								<td>
									{league.endDate
										? new Date(league.endDate).toLocaleDateString()
										: 'N/A'}
								</td>
								<td>
									{/* Edit League */}
									<Link className='btn btn-edit' to={`/leagues/${league._id}`}>
										Edit
									</Link>
									{/* Delete League */}
									<button
										className='btn btn-delete'
										onClick={() => handleDelete(league._id)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No leagues found.</p>
			)}
		</div>
	)
}

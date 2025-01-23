// Boosters.js
// Import necessary dependencies
import React, { useState, useEffect } from 'react' // React and hooks
import { Link } from 'react-router-dom' // For navigation links
import axiosInstance from '../../axiosInstance' // Axios instance for API calls
import { toast } from 'react-toastify' // For notifications
import './style/boosters.scss' // Import SCSS styles
import Loader from '../../components/Loading.jsx' // Loading spinner component

// Boosters component for admin to manage boosters
export default function Boosters() {
	// State variables
	const [boosters, setBoosters] = useState([]) // List of boosters
	const [totalBoosters, setTotalBoosters] = useState(0) // Total number of boosters
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState('') // Error message
	const [page, setPage] = useState(1) // Current page number
	const [pages, setPages] = useState(1) // Total number of pages
	const [keyword, setKeyword] = useState('') // Search keyword

	// Fetch boosters when component mounts or when page or keyword changes
	useEffect(() => {
		fetchBoosters()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, keyword])

	// Function to fetch boosters from the server
	const fetchBoosters = async () => {
		setLoading(true) // Set loading state to true
		try {
			// Make API call to get boosters with pagination and search
			const { data } = await axiosInstance.get('/user-leagues/booster/all', {
				params: {
					pageNumber: page,
					keyword,
				},
			})
			// Update state with fetched data
			setTotalBoosters(data.totalBoosters) // Set total number of boosters
			setBoosters(data.boosters) // Set boosters list
			setPages(data.pages) // Set total number of pages
			setLoading(false) // Set loading state to false
		} catch (err) {
			// Handle errors
			setError('Failed to fetch boosters.') // Set error message
			setLoading(false) // Set loading state to false
			toast.error('Failed to fetch boosters.') // Show error notification
		}
	}

	// Function to delete a booster
	const deleteBooster = async boosterId => {
		if (window.confirm('Are you sure you want to delete this booster?')) {
			try {
				// Make API call to delete booster
				await axiosInstance.delete(`/user-leagues/admin/booster/${boosterId}`)
				toast.success('Booster deleted successfully.') // Show success notification
				// Remove deleted booster from the list
				setBoosters(boosters.filter(booster => booster._id !== boosterId))
			} catch (err) {
				toast.error('Failed to delete booster.') // Show error notification
			}
		}
	}

	// Function to handle search form submission
	const handleSearch = e => {
		e.preventDefault() // Prevent default form submission
		setPage(1) // Reset to first page
		fetchBoosters() // Fetch boosters with new keyword
	}

	// Function to handle page change
	const handlePageChange = newPage => {
		setPage(newPage) // Set current page to new page
	}

	// Render component
	return (
		<div className='boosters-page'>
			<h1 className='title'>Booster Management</h1>

			{/* Search Bar */}
			<form className='search-bar' onSubmit={handleSearch}>
				<Link className='create-booster btn' to='/booster'>
					Create Booster
				</Link>
				<input
					type='text'
					placeholder='Search by title...'
					value={keyword}
					onChange={e => setKeyword(e.target.value)} // Update keyword state
				/>
				<button type='submit'>Search</button>
				<p className='count'>Boosters: {totalBoosters}</p>
			</form>

			{/* Boosters Table */}
			{loading ? (
				// Show loader when loading
				<div className='dfjccaic'>
					<Loader />
				</div>
			) : error ? (
				// Show error message if error occurs
				<div className='error-message'>{error}</div>
			) : (
				// Show boosters table when data is loaded
				<table className='boosters-table'>
					<thead>
						<tr>
							<th>Image</th>
							<th>Name</th>
							<th>Description</th>
							<th>Is Active</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{boosters.length > 0 ? (
							// Map through boosters and display each booster in a table row
							boosters.map(booster => (
								<tr key={booster._id}>
									<td>
										<img src={booster.iconUrl} alt={booster.title} />
									</td>
									<td>{booster.name}</td>
									<td>{booster.description}</td>
									<td>{booster.isActive ? 'Yes' : 'No'}</td>
									<td>
										{/* Edit booster button */}
										<Link
											className='btn btn-edit'
											to={`/booster/${booster._id}`}
										>
											Edit
										</Link>
										{/* Delete booster button */}
										<button
											className='btn btn-delete'
											onClick={() => deleteBooster(booster._id)}
										>
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							// Show message if no boosters found
							<tr>
								<td colSpan='5'>No boosters found.</td>
							</tr>
						)}
					</tbody>
				</table>
			)}

			{/* Pagination Controls */}
			{pages > 1 && (
				<div className='pagination'>
					{/* Generate pagination buttons */}
					{[...Array(pages).keys()].map(x => (
						<button
							key={x + 1}
							onClick={() => handlePageChange(x + 1)}
							className={x + 1 === page ? 'active' : ''}
						>
							{x + 1}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

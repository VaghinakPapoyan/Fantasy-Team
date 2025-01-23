// Prizes.js
// Import necessary dependencies
import React, { useState, useEffect } from 'react' // React and hooks
import { Link } from 'react-router-dom' // For navigation links
import axiosInstance from '../../axiosInstance' // Axios instance for API calls
import { toast } from 'react-toastify' // For notifications
import './style/prizes.scss' // Import SCSS styles
import Loader from '../../components/Loading' // Loading spinner component

// Prizes component for admin to manage prizes
export default function Prizes() {
	// State variables
	const [prizes, setPrizes] = useState([]) // List of prizes
	const [totalPrizes, setTotalPrizes] = useState(0) // Total number of prizes
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState('') // Error message
	const [page, setPage] = useState(1) // Current page number
	const [pages, setPages] = useState(1) // Total number of pages
	const [keyword, setKeyword] = useState('') // Search keyword

	// Fetch prizes when component mounts or when page or keyword changes
	useEffect(() => {
		fetchPrizes()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, keyword])

	// Function to fetch prizes from the server
	const fetchPrizes = async () => {
		setLoading(true) // Set loading state to true
		try {
			// Make API call to get prizes with pagination and search
			const { data } = await axiosInstance.get('/user-leagues/prize/all', {
				params: {
					pageNumber: page,
					keyword,
				},
			})
			// Update state with fetched data
			setTotalPrizes(data.totalPrizes) // Set total number of prizes
			setPrizes(data.prizes) // Set prizes list
			setPages(data.pages) // Set total number of pages
			setLoading(false) // Set loading state to false
		} catch (err) {
			// Handle errors
			setError('Failed to fetch prizes.') // Set error message
			setLoading(false) // Set loading state to false
			toast.error('Failed to fetch prizes.') // Show error notification
		}
	}

	// Function to delete a prize
	const deletePrize = async prizeId => {
		if (window.confirm('Are you sure you want to delete this prize?')) {
			try {
				// Make API call to delete prize
				await axiosInstance.delete(`/user-leagues/admin/prize/${prizeId}`)
				toast.success('Prize deleted successfully.') // Show success notification
				// Remove deleted prize from the list
				setPrizes(prizes.filter(prize => prize._id !== prizeId))
			} catch (err) {
				toast.error('Failed to delete prize.') // Show error notification
			}
		}
	}

	// Function to handle search form submission
	const handleSearch = e => {
		e.preventDefault() // Prevent default form submission
		setPage(1) // Reset to first page
		fetchPrizes() // Fetch prizes with new keyword
	}

	// Function to handle page change
	const handlePageChange = newPage => {
		setPage(newPage) // Set current page to new page
	}

	// Render component
	return (
		<div className='prizes-page'>
			<h1 className='title'>Prize Management</h1>

			{/* Search Bar */}
			<form className='search-bar' onSubmit={handleSearch}>
				<Link className='create-prize btn' to='/prize'>
					Create Prize
				</Link>
				<input
					type='text'
					placeholder='Search by title...'
					value={keyword}
					onChange={e => setKeyword(e.target.value)} // Update keyword state
				/>
				<button type='submit'>Search</button>
				<p className='count'>Prizes: {totalPrizes}</p>
			</form>

			{/* Prizes Table */}
			{loading ? (
				// Show loader when loading
				<div className='dfjccaic'>
					<Loader />
				</div>
			) : error ? (
				// Show error message if error occurs
				<div className='error-message'>{error}</div>
			) : (
				// Show prizes table when data is loaded
				<table className='prizes-table'>
					<thead>
						<tr>
							<th>Image</th>
							<th>Title</th>
							<th>Reward</th>
							<th>Is Active</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{prizes.length > 0 ? (
							// Map through prizes and display each prize in a table row
							prizes.map(prize => (
								<tr key={prize._id}>
									<td>
										<img src={prize.imageUrl} alt={prize.title} />
									</td>
									<td>{prize.title}</td>
									<td>{prize.reward}</td>
									<td>{prize.isActive ? 'Yes' : 'No'}</td>
									<td>
										{/* Edit prize button */}
										<Link className='btn btn-edit' to={`/prize/${prize._id}`}>
											Edit
										</Link>
										{/* Delete prize button */}
										<button
											className='btn btn-delete'
											onClick={() => deletePrize(prize._id)}
										>
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							// Show message if no prizes found
							<tr>
								<td colSpan='5'>No prizes found.</td>
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

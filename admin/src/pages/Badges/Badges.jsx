// Import necessary dependencies
import React, { useState, useEffect } from 'react' // React and hooks
import { Link } from 'react-router-dom' // For navigation links
import axiosInstance from '../../axiosInstance' // Axios instance for API calls
import { toast } from 'react-toastify' // For notifications
import './style/badges.scss' // Import SCSS styles
import Loader from '../../components/Loading' // Loading spinner component

// Badges component for admin to manage badges
export default function Badges() {
	// State variables
	const [badges, setBadges] = useState([]) // List of badges
	const [totalBadges, setTotalBadges] = useState(0) // Total number of badges
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState('') // Error message
	const [page, setPage] = useState(1) // Current page number
	const [pages, setPages] = useState(1) // Total number of pages
	const [keyword, setKeyword] = useState('') // Search keyword

	// Fetch badges when component mounts or when page or keyword changes
	useEffect(() => {
		fetchBadges()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, keyword])

	// Function to fetch badges from the server
	const fetchBadges = async () => {
		setLoading(true) // Set loading state to true
		try {
			// Make API call to get badges with pagination and search
			const { data } = await axiosInstance.get('/user-leagues/badge/all', {
				params: {
					pageNumber: page,
					keyword,
				},
			})
			// Update state with fetched data
			setTotalBadges(data.totalBadges) // Set total number of badges
			setBadges(data.badges) // Set badges list
			setPages(data.pages) // Set total number of pages
			setLoading(false) // Set loading state to false
		} catch (err) {
			// Handle errors
			setError('Failed to fetch badges.') // Set error message
			setLoading(false) // Set loading state to false
			toast.error('Failed to fetch badges.') // Show error notification
		}
	}

	// Function to delete a badge
	const deleteBadge = async badgeId => {
		if (window.confirm('Are you sure you want to delete this badge?')) {
			try {
				// Make API call to delete badge
				await axiosInstance.delete(`user-leagues/admin/badge/${badgeId}`)
				toast.success('Badge deleted successfully.') // Show success notification
				// Remove deleted badge from the list
				setBadges(badges.filter(badge => badge._id !== badgeId))
			} catch (err) {
				toast.error('Failed to delete badge.') // Show error notification
			}
		}
	}

	// Function to handle search form submission
	const handleSearch = e => {
		e.preventDefault() // Prevent default form submission
		setPage(1) // Reset to first page
		fetchBadges() // Fetch badges with new keyword
	}

	// Function to handle page change
	const handlePageChange = newPage => {
		setPage(newPage) // Set current page to new page
	}

	// Render component
	return (
		<div className='badges-page'>
			<h1 className='title'>Badge Management</h1>

			{/* Search Bar */}
			<form className='search-bar' onSubmit={handleSearch}>
				<Link className='create-badge btn' to='/badge'>
					Create Badge
				</Link>
				<input
					type='text'
					placeholder='Search by name...'
					value={keyword}
					onChange={e => setKeyword(e.target.value)} // Update keyword state
				/>
				<button type='submit'>Search</button>
				<p className='count'>Badges: {totalBadges}</p>
			</form>

			{/* Badges Table */}
			{loading ? (
				// Show loader when loading
				<div className='dfjccaic'>
					<Loader />
				</div>
			) : error ? (
				// Show error message if error occurs
				<div className='error-message'>{error}</div>
			) : (
				// Show badges table when data is loaded
				<table className='badges-table'>
					<thead>
						<tr>
							<th>Icon</th>
							<th>Name</th>
							<th>XP Value</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{badges.length > 0 ? (
							// Map through badges and display each badge in a table row
							badges.map(badge => (
								<tr key={badge._id}>
									<td>
										<img src={badge.iconUrl} alt={badge.name} />
									</td>
									<td>{badge.name}</td>
									<td>{badge.xpValue}</td>
									<td>
										{/* Edit badge button */}
										<Link className='btn btn-edit' to={`/badge/${badge._id}`}>
											Edit
										</Link>
										{/* Delete badge button */}
										<button
											className='btn btn-delete'
											onClick={() => deleteBadge(badge._id)}
										>
											Delete
										</button>
									</td>
								</tr>
							))
						) : (
							// Show message if no badges found
							<tr>
								<td colSpan='4'>No badges found.</td>
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

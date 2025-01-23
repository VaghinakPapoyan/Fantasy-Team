import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../axiosInstance'
import { toast } from 'react-toastify'
import './style/users.scss' // Import the SCSS styles
import Loader from '../../components/Loading'
import SendEmailModal from '../../components/SendEmailModal.jsx'

export default function Users() {
	const [users, setUsers] = useState([])
	const [totalUsers, setTotalUsers] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [page, setPage] = useState(1)
	const [pages, setPages] = useState(1)
	const [keyword, setKeyword] = useState('')
	const [showSendEmailModal, setShowSendEmailModal] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)

	useEffect(() => {
		fetchUsers()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, keyword])

	const fetchUsers = async () => {
		setLoading(true)
		try {
			const { data } = await axiosInstance.get('/users/admin/all', {
				params: {
					pageNumber: page,
					pageSize: 10,
					keyword,
				},
			})
			setTotalUsers(data.totalUsers)
			setUsers(data.users)
			setPages(data.pages)
			setLoading(false)
		} catch (err) {
			setError('Failed to fetch users.')
			setLoading(false)
			toast.error('Failed to fetch users.')
		}
	}
	const deleteUser = async userId => {
		if (window.confirm('Are you sure you want to delete this user?')) {
			try {
				await axiosInstance.delete(`/users/admin/delete/${userId}`)
				toast.success('User deleted successfully.')
				setUsers(users.filter(user => user._id !== userId))
			} catch (err) {
				toast.error('Failed to delete user.')
			}
		}
	}

	const openSendEmailModal = user => {
		setSelectedUser(user)
		setShowSendEmailModal(true)
	}

	const closeSendEmailModal = () => {
		setSelectedUser(null)
		setShowSendEmailModal(false)
	}

	const handleSearch = e => {
		e.preventDefault()
		setPage(1)
		fetchUsers()
	}

	const handlePageChange = newPage => {
		setPage(newPage)
	}

	return (
		<div className='users-page'>
			<h1 className='title'>User Management</h1>

			{/* Search Bar */}
			<form className='search-bar' onSubmit={handleSearch}>
				<Link className='create-badge btn' to='/create-user'>
					Create User
				</Link>
				<input
					type='text'
					placeholder='Search by name or email...'
					value={keyword}
					onChange={e => setKeyword(e.target.value)}
				/>
				<button type='submit'>Search</button>
				<p className='count'>Users: {totalUsers}</p>
			</form>

			{/* Users Table */}
			{loading ? (
				<div className='dfjccaic'>
					<Loader />
				</div>
			) : error ? (
				<div className='error-message'>{error}</div>
			) : (
				<table className='users-table'>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Status</th>
							<th>Date Registered</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.length > 0 ? (
							users.map(user => (
								<tr key={user._id}>
									<td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
									<td>{user.email}</td>
									<td className={`role ${user.role}`}>{user.role}</td>
									<td className={`status ${user.status}`}>{user.status}</td>
									<td>
										{new Date(user.dateOfRegistration).toLocaleDateString()}
									</td>
									<td>
										{/* Existing actions */}
										<Link className='btn btn-edit' to={`/users/${user._id}`}>
											Edit
										</Link>
										<button
											className='btn btn-delete'
											onClick={() => deleteUser(user._id)}
										>
											Delete
										</button>
										{/* New Send Email button */}
										<button
											className='btn btn-send-email'
											onClick={() => openSendEmailModal(user)}
										>
											Send Email
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan='6'>No users found.</td>
							</tr>
						)}
					</tbody>
				</table>
			)}

			{/* Pagination Controls */}
			{pages > 1 && (
				<div className='pagination'>
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
			{showSendEmailModal && (
				<SendEmailModal user={selectedUser} onClose={closeSendEmailModal} />
			)}
		</div>
	)
}

import React, { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance.js'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../components/Loading.jsx'

export default function List({
	entityName,
	apiEndpoint,
	columns,
	createPath,
	editPath,
	deletePath,
}) {
	// State variables
	const [items, setItems] = useState([]) // List of items
	const [loading, setLoading] = useState(false) // Loading state
	const [error, setError] = useState('') // Error message

	// Fetch items when component mounts
	useEffect(() => {
		fetchItems()
	}, [])

	// Function to fetch items from the API
	const fetchItems = async () => {
		setLoading(true)
		try {
			const { data } = await axiosInstance.get('/' + apiEndpoint)
			setItems(data)
			setLoading(false)
		} catch (err) {
			setError(`Failed to fetch ${entityName.toLowerCase()}s.`)
			setLoading(false)
			toast.error(`Failed to fetch ${entityName.toLowerCase()}s.`)
		}
	}

	// Handle delete item
	const handleDelete = async id => {
		if (
			window.confirm(
				`Are you sure you want to delete this ${entityName.toLowerCase()}?`
			)
		) {
			try {
				await axiosInstance.delete(`${deletePath}/${id}`)
				toast.success(`${entityName} deleted successfully.`)
				// Remove the deleted item from the state
				setItems(items.filter(item => item._id !== id))
			} catch (err) {
				toast.error(`Failed to delete ${entityName.toLowerCase()}.`)
			}
		}
	}

	if (loading) {
		return (
			<div className={`${entityName.toLowerCase()}s-page dfjccaic`}>
				<Loading />
			</div>
		)
	}

	if (error) {
		return <div className='error-message'>{error}</div>
	}

	return (
		<div className={`${entityName.toLowerCase()}s-page`}>
			<h1 className='title'>{entityName}s</h1>
			{/* Button to create a new item */}
			{/* <button className='btn btn-create' onClick={() => navigate(createPath)}>`
				Create New {entityName}
			</button> */}
			{items.length > 0 ? (
				<table className={`${entityName.toLowerCase()}s-table`}>
					<thead>
						<tr>
							{columns.map(col => (
								<th key={col.field}>{col.label}</th>
							))}
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map(item => (
							<tr key={item._id}>
								{columns.map(col => (
									<td key={col.field}>
										{col.render
											? col.render(item[col.field], item)
											: item[col.field]}
									</td>
								))}
								<td>
									{/* Edit Item */}
									<Link
										className='btn btn-edit'
										to={
											editPath === 'user' ? `/users/${item._id}` : `${item._id}`
										}
									>
										Edit
									</Link>
									{/* Delete Item */}
									<button
										className='btn btn-delete'
										onClick={() => handleDelete(item._id)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No {entityName.toLowerCase()}s found.</p>
			)}
		</div>
	)
}

import React from 'react'
import List from '../../components/List.jsx'
import { useParams } from 'react-router-dom'

export default function Users() {
	const { id } = useParams()
	const columns = [
		{ label: 'First Name', field: 'firstName' },
		{ label: 'Last Name', field: 'lastName' },
		{ label: 'Email', field: 'email' },
		{ label: 'Role', field: 'role' },
		{
			label: 'Registration Date',
			field: 'dateOfRegistration',
			render: value => (value ? new Date(value).toLocaleDateString() : 'N/A'),
		},
	]

	return (
		<List
			entityName='User'
			apiEndpoint={'leagues/users/' + id}
			columns={columns}
			editPath={'user'}
		/>
	)
}

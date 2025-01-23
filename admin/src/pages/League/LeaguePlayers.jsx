import React from 'react'
import List from '../../components/List.jsx'
import { useParams } from 'react-router-dom'

export default function Players() {
	const { id } = useParams()

	const columns = [
		{ label: 'Name', field: 'playerName' },
		{ label: 'Position', field: 'position' },
		{ label: 'Nationality', field: 'nationality' },
		{
			label: 'Age',
			field: 'dateOfBirth',
			render: value => {
				const today = new Date()
				const birthDate = new Date(value) // Convert value to a Date object

				let age = today.getFullYear() - birthDate.getFullYear()
				const monthDiff = today.getMonth() - birthDate.getMonth()

				// Adjust age if the birthday hasn't occurred this year yet
				if (
					monthDiff < 0 ||
					(monthDiff === 0 && today.getDate() < birthDate.getDate())
				) {
					age--
				}

				return age // Return the calculated age
			},
		},
	]

	return (
		<List
			entityName='Player'
			apiEndpoint={'leagues/players/all/' + id}
			columns={columns}
			editPath={'leagues/players/' + id}
			deletePath={'/leagues/admin/players'}
		/>
	)
}

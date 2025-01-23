// src/pages/Clubs.jsx

import React from 'react'
import List from '../../components/List.jsx'
import { useParams } from 'react-router-dom'

export default function Clubs() {
	const { id } = useParams()

	const columns = [
		{
			label: 'Logo',
			field: 'crestUrl',
			render: value => <img src={value} alt='club' />,
		},
		{ label: 'Name', field: 'clubName' },
		{ label: 'Founded', field: 'founded' },
		{
			label: 'Stadium',
			field: 'venue',
			render: value => (value ? value : 'N/A'),
		},
	]

	return (
		<List
			entityName='Club'
			apiEndpoint={'leagues/clubs/all/' + id}
			columns={columns}
			editPath={'leagues/clubs/' + id}
			deletePath={'/leagues/admin/clubs'}
		/>
	)
}

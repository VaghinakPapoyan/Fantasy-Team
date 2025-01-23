// Feedbacks.jsx

import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance.js' // Adjust the path as necessary
import './style/feedback.scss'

const Feedbacks = () => {
	const [users, setUsers] = useState([])
	const [selectedUserId, setSelectedUserId] = useState(null)
	const [messages, setMessages] = useState([])
	const [newMessage, setNewMessage] = useState('')
	const [filter, setFilter] = useState('') // New state for filter input

	// Fetch all users when the component mounts
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axiosInstance.get('/users/admin/all')
				setUsers(response.data.users)
			} catch (error) {
				console.error('Error fetching users:', error)
			}
		}

		fetchUsers()
	}, [])

	// Fetch messages when a user is selected
	useEffect(() => {
		const fetchMessages = async () => {
			if (!selectedUserId) return

			try {
				const response = await axiosInstance.get(
					`/messages?userId=${selectedUserId}`
				)
				setMessages(response.data.data)
			} catch (error) {
				console.error('Error fetching messages:', error)
			}
		}

		fetchMessages()
	}, [selectedUserId])

	// Handle sending a new message
	const handleSendMessage = async e => {
		e.preventDefault()

		if (newMessage.trim() === '') return

		try {
			const messageData = {
				userId: selectedUserId,
				subject: 'Admin Reply', // You can modify the subject as needed
				messageBody: newMessage,
			}

			const response = await axiosInstance.post('/messages', messageData)
			setMessages([...messages, response.data.data])
			setNewMessage('')
		} catch (error) {
			console.error('Error sending message:', error)
		}
	}

	// Filter users based on filter input
	const filteredUsers = users.filter(
		user =>
			user.name?.toLowerCase().includes(filter.toLowerCase()) ||
			user.email?.toLowerCase().includes(filter.toLowerCase())
	)

	return (
		<div className='feedbacks-container'>
			<div className='users-list'>
				<h2>Users</h2>
				<input
					type='text'
					placeholder='Filter by name or email...'
					value={filter}
					onChange={e => setFilter(e.target.value)}
					className='filter-input'
				/>
				<ul>
					{filteredUsers?.map(user => (
						<li
							key={user._id}
							className={user._id === selectedUserId ? 'selected' : ''}
							onClick={() => setSelectedUserId(user._id)}
							title={user.email}
						>
							{user.firstName || user.lastName
								? `${user.firstName} ${user.lastName}`
								: user.email}
						</li>
					))}
				</ul>
			</div>
			<div className='chat-window'>
				{selectedUserId ? (
					<>
						<div className='messages'>
							{messages.map(message => (
								<div
									key={message._id}
									className={`message ${
										message.senderType === 'user' ? 'user' : 'admin'
									}`}
								>
									<p>{message.messageBody}</p>
									<span className='timestamp'>
										{new Date(message.createdAt).toLocaleString()}
									</span>
								</div>
							))}
						</div>
						<form className='message-input' onSubmit={handleSendMessage}>
							<input
								type='text'
								placeholder='Type your message...'
								value={newMessage}
								onChange={e => setNewMessage(e.target.value)}
							/>
							<button type='submit'>Send</button>
						</form>
					</>
				) : (
					<div className='no-user-selected'>
						<p>Select a user to start chatting</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Feedbacks

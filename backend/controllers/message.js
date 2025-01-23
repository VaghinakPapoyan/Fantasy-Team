// controllers/messageController.js

import Message from '../models/Message.js'

// Controller to send a message
export const sendMessage = async (req, res) => {
	try {
		const { subject, messageBody, userId } = req.body
		const senderType = req.user.role === 'super-admin' ? 'admin' : 'user'
		const senderId = req.user.id

		// For users, ensure they can only send messages associated with their own userId
		if (
			senderType === 'user' &&
			userId &&
			userId.toString() !== senderId.toString()
		) {
			return res
				.status(403)
				.json({ error: 'Users can only send messages on their own behalf' })
		}

		// For admins, userId must be specified to send a message to a specific user
		if (senderType === 'admin' && !userId) {
			return res
				.status(400)
				.json({ error: 'userId is required for admins to send messages' })
		}

		const message = new Message({
			senderType,
			userId: senderType !== 'admin' ? senderId : userId,
			subject,
			messageBody,
		})

		await message.save()

		return res
			.status(201)
			.json({ message: 'Message sent successfully', data: message })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

// Controller to get messages
export const getMessages = async (req, res) => {
	try {
		const senderType = req.user.role === 'super-admin' ? 'admin' : 'user'
		const senderId = req.user.id

		let messages

		if (senderType === 'user') {
			// Users can see all messages associated with their userId
			messages = await Message.find({ userId: senderId }).sort({
				createdAt: 1,
			})
		} else if (senderType === 'admin') {
			// Admins can fetch messages for all users or a specific user
			const { userId } = req.query

			const query = userId ? { userId } : {}

			messages = await Message.find(query).sort({ createdAt: 1 })
		} else {
			return res.status(403).json({ error: 'Unauthorized access' })
		}

		return res.status(200).json({ data: messages })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

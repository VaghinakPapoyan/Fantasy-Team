import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../axiosInstance'

export default function SendEmailModal({ user, onClose }) {
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [sending, setSending] = useState(false)

	const sendEmail = async e => {
		e.preventDefault()
		setSending(true)
		try {
			await axiosInstance.post(`/users/admin/send-email/${user._id}`, {
				subject,
				message,
			})
			toast.success('Email sent successfully.')
			setSending(false)
			onClose()
		} catch (err) {
			toast.error('Failed to send email.')
			setSending(false)
		}
	}

	return (
		<div className='modal-overlay'>
			<div className='modal'>
				<h2>Send Email to {user.email}</h2>
				<form onSubmit={sendEmail}>
					<div className='form-group'>
						<label>Subject</label>
						<input
							type='text'
							value={subject}
							onChange={e => setSubject(e.target.value)}
							required
						/>
					</div>
					<div className='form-group'>
						<label>Message</label>
						<textarea
							value={message}
							onChange={e => setMessage(e.target.value)}
							required
						/>
					</div>
					<div className='form-actions'>
						<button type='submit' disabled={sending}>
							{sending ? 'Sending...' : 'Send Email'}
						</button>
						<button type='button' onClick={onClose}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

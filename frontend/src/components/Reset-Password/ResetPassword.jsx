// components/ResetPassword.jsx

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import resetPasswordImage from '../../assets/images/reset-password.svg'
import { resetPasswordThunk } from '../../features/user/userSlice.js'

export default function ResetPassword({ closeAllModals, openLoginModal }) {
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { token } = useParams()

	const { loading, error, message } = useSelector(state => state.user)

	// Show toast notifications if there's an error or a success message
	useEffect(() => {
		if (error) {
			toast.error(error)
		}
		if (message) {
			toast.success(message)
		}
	}, [error, message])

	const handleSaveNewPassword = e => {
		e.preventDefault()
		// Basic client-side validation
		if (!newPassword || !confirmPassword) {
			toast.info('Please fill in both fields.')
			return
		}
		if (newPassword !== confirmPassword) {
			toast.error('Passwords do not match.')
			return
		}

		// Dispatch the reset password thunk
		dispatch(resetPasswordThunk({ token, password: newPassword }))
			.unwrap()
			.then(() => {
				// Optional: navigate to login on success
				closeAllModals()
				openLoginModal()
				navigate('/')
			})
			.catch(err => {
				// The error is already handled with toast from Redux state
			})
	}

	return (
		<div className='registration reset-password'>
			<div className='background' onClick={closeAllModals}></div>
			<form className='verification-container reset-password'>
				<div className='img'>
					<img src={resetPasswordImage} alt='reset password' />
				</div>
				<h2 className='titlee'>SET NEW PASSWORD</h2>
				<p className='subtitle'>Must be at least 8 characters</p>

				<div className='input-container f'>
					<input
						type='password'
						className='styled-input'
						placeholder=' '
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
					/>
					<label className='input-label'>Password</label>
				</div>
				<div className='input-container l'>
					<input
						type='password'
						className='styled-input'
						placeholder=' '
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
					/>
					<label className='input-label'>Confirm password</label>
				</div>

				<div className='actions forget-password'>
					<button
						className='btn blue'
						onClick={handleSaveNewPassword}
						type='submit'
						disabled={loading}
					>
						{loading ? 'Saving...' : 'Save new password'}
					</button>
				</div>

				{/* No inline messages; only toasts */}
				<div
					className='close'
					onClick={() => {
						closeAllModals()
						navigate('/')
					}}
				>
					<span></span>
					<span></span>
				</div>
			</form>
		</div>
	)
}

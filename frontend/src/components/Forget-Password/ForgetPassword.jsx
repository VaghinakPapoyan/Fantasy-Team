import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import fingerprintImage from '../../assets/images/fingerprint.svg'
import { requestPasswordResetThunk } from '../../features/user/userSlice.js'

export default function ForgetPassword({
	onBack,
	defaultEmail,
	closeAllModals,
}) {
	const [email, setEmail] = useState(defaultEmail)
	const [count, setCount] = useState(0)
	const dispatch = useDispatch()

	// Get loading, error, message from Redux store
	const { loading, error, message } = useSelector(state => state.user)

	// Trigger toast messages whenever "error" or "message" changes
	useEffect(() => {
		if (count !== 0) {
			if (error) {
				toast.error(error)
			}
			if (message) {
				toast.success(message)
			}
		}
		setCount(state => state + 1)
	}, [error, message])

	const handleResetPasswordRequest = async e => {
		e.preventDefault()
		if (!email) {
			toast.info('Please enter an email.')
			return
		}
		const result = await dispatch(requestPasswordResetThunk(email))
		if (result.meta.requestStatus === '"fulfilled"') closeAllModals()
	}

	return (
		<form className='verification-container'>
			<button type='button' className='back-button' onClick={onBack}>
				Back
			</button>
			<div className='img'>
				<img src={fingerprintImage} alt='fingerprint' />
			</div>
			<h2 className='titlee'>FORGOT PASSWORD?</h2>
			<p className='subtitle'>
				No worries, we’ll send you reset <br /> instructions
			</p>

			<div className='input-container'>
				<input
					type='email'
					className='styled-input'
					placeholder=' '
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<label className='input-label'>Enter your email</label>
			</div>

			<div className='actions forget-password'>
				<button
					type='submit'
					className='btn blue'
					onClick={handleResetPasswordRequest}
					disabled={loading}
				>
					{loading ? 'Sending...' : 'Reset password'}
				</button>
			</div>

			{/* No inline messages; we only show toasts */}
			<div className='close' onClick={closeAllModals}>
				<span></span>
				<span></span>
			</div>
		</form>
	)
}

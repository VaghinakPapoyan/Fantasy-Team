import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { resendVerification } from '../../services/authService.js'
import './styles.scss'
import { useDispatch } from 'react-redux'
import { verifyUserThunk } from '../../features/user/userSlice'

import envelopeImage from '../../assets/images/envelope.svg'

export default function Verification({
	defaultCode = '',
	defaultEmail = '',
	onBack,
	// If needed, you can pass closeModals or a callback
	// from your parent to close the modals on success.
	closeAllModals,
}) {
	// Split the initial defaultCode into an array of individual chars
	const [codeDigits, setCodeDigits] = useState(
		defaultCode.split('').concat(['', '', '', '']).slice(0, 4)
	)
	const [resendCooldown, setResendCooldown] = useState(0)
	const dispatch = useDispatch()

	useEffect(() => {
		if (codeDigits.filter(digit => digit !== '').length === 4) {
			handleVerify()
		}
	}, [codeDigits])

	// Start a timer if we have a cooldown
	useEffect(() => {
		let timer
		if (resendCooldown > 0) {
			timer = setInterval(() => {
				setResendCooldown(prev => prev - 1)
			}, 1000)
		}
		return () => clearInterval(timer)
	}, [resendCooldown])

	// Handle digit input changes
	const handleChange = (index, value) => {
		if (/^\d*$/.test(value)) {
			// Only digits
			const updated = [...codeDigits]
			updated[index] = value.slice(-1) // keep last digit
			setCodeDigits(updated)

			// Automatically focus next field if a digit was entered
			if (value && index < 3) {
				const nextInput = document.getElementById(`codeDigit-${index + 1}`)
				nextInput?.focus()
			}
		}
	}

	// Submit the verification code to the backend
	const handleVerify = async () => {
		if (codeDigits.length < 4) {
			toast.error('Please enter the 4-digit code')
			return
		}

		try {
			const resultAction = await dispatch(
				verifyUserThunk({
					email: defaultEmail,
					verificationCode: Number(codeDigits.join('')),
				})
			)

			if (verifyUserThunk.fulfilled.match(resultAction)) {
				// On success
				toast.success('Email verified!')
				closeAllModals && closeAllModals()
			} else {
				toast.error(resultAction.payload || 'Verification failed.')
			}
		} catch (err) {
			toast.error('Something went wrong during verification.')
		}
	}

	// Resend the code (simple example with 30s cooldown)
	const handleResend = async () => {
		if (resendCooldown > 0) return // still in cooldown
		try {
			await resendVerification({ email: defaultEmail })
			toast.info('Verification code resent.')
			setResendCooldown(30)
		} catch (error) {
			const errorMsg = error.response?.data?.message || 'Failed to resend code.'
			toast.error(errorMsg)
		}
	}

	return (
		<div className='verification-container'>
			<button className='back-button' onClick={onBack}>
				Back
			</button>
			<div className='img'>
				<img src={envelopeImage} alt='envelope' />
			</div>
			<h2 className='titlee'>VERIFICATION</h2>
			<p className='subtitle'>
				We’ve sent you email with code. <br /> Enter the code below
			</p>

			<div className='code-inputs'>
				{codeDigits.map((digit, idx) => (
					<input
						key={idx}
						id={`codeDigit-${idx}`}
						className='code-input'
						value={digit}
						onChange={e => handleChange(idx, e.target.value)}
						maxLength={1}
						type='text'
						inputMode='numeric'
						pattern='[0-9]*'
					/>
				))}
			</div>

			<div className='actions'>
				<div className='resend-container'>
					{!resendCooldown ? (
						<p>
							Didn’t get email?
							<span className='resend-link' onClick={handleResend}>
								Resend Now
							</span>
						</p>
					) : (
						<p>
							Resend in{' '}
							<span className='resend-disabled'>{resendCooldown}s</span>
						</p>
					)}
				</div>
			</div>
			<div className='close' onClick={() => closeAllModals()}>
				<span></span>
				<span></span>
			</div>
		</div>
	)
}

// components/RegistrationForm.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { registerUserThunk } from '../../features/user/userSlice'

import registrationImage from '../../assets/images/registration.png'
import fbImage from '../../assets/images/facebook-colored.svg'
import googleImage from '../../assets/images/google-colored.svg'
import appleImage from '../../assets/images/apple.svg'
import vkImage from '../../assets/images/vk-colored.svg'
import './styles.scss'

const RegistrationForm = ({
	onSuccess,
	closeRegistrationModal,
	openLoginModal,
	email,
	setEmail,
}) => {
	const [dateOfBirth, setDateOfBirth] = useState('')
	const [password, setPassword] = useState('')
	const [promoCode, setPromoCode] = useState('')
	const [loading, setLoading] = useState(false)

	const dispatch = useDispatch()

	const handleRegister = async e => {
		e.preventDefault()
		try {
			// Build up the user data
			const userData = {
				email,
				dateOfBirth,
				password,
				promoCode,
			}

			// Dispatch the register thunk
			const resultAction = await dispatch(registerUserThunk(userData))

			if (registerUserThunk.fulfilled.match(resultAction)) {
				// If successful:
				toast.success(
					'Registration successful! Please check your email for the  ification code.'
				)
				// The backend might have returned { code, message } in resultAction.payload
				// If you want to pass the code to a parent or do something else:
				onSuccess && onSuccess(resultAction.payload.code)
			} else {
				// If it was rejected
				toast.error(resultAction.payload || 'Registration failed.')
			}
		} catch (err) {
			toast.error('Something went wrong during registration.')
		}
	}

	return (
		<form className='registration-container'>
			<div className='left'>
				<img src={registrationImage} alt='registration' />
			</div>
			<div className='right'>
				<h3>Create new account</h3>

				{/* Just example buttons */}
				<div className='buttons'>
					<button type='button' className='btn'>
						Sign up
					</button>
					<button
						type='button'
						className='btn'
						onClick={() => {
							openLoginModal()
							closeRegistrationModal()
						}}
					>
						Sign in
					</button>
				</div>

				{/* Social Login (if you have them) */}
				<div className='fast-login'>
					<button type='button'>
						<img src={fbImage} alt='Facebook' />
					</button>
					<button type='button'>
						<img src={googleImage} alt='Google' />
					</button>
					<button type='button'>
						<img src={appleImage} alt='Apple' />
					</button>
					<button type='button'>
						<img src={vkImage} alt='Vk' />
					</button>
				</div>

				<div className='line'>
					<div className='left'></div>
					<p>or</p>
					<div className='right'></div>
				</div>

				{/* Email */}
				<div className='input-container'>
					<input
						type='email'
						className='styled-input'
						placeholder=' '
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<label className='input-label'>Email</label>
				</div>

				{/* Date of Birth */}
				<div className='input-container'>
					<input
						type='date'
						className='styled-input'
						placeholder=' '
						value={dateOfBirth}
						onChange={e => setDateOfBirth(e.target.value)}
					/>
					<label className='input-label'>Date Of Birth</label>
				</div>

				{/* Password */}
				<div className='input-container'>
					<input
						type='password'
						className='styled-input'
						placeholder=' '
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
					<label className='input-label'>Password</label>
				</div>

				{/* Promo Code */}
				<div className='input-container last'>
					<input
						type='text'
						className='styled-input'
						placeholder=' '
						value={promoCode}
						onChange={e => setPromoCode(e.target.value)}
					/>
					<label className='input-label'>Promo code (optional)</label>
				</div>

				{/* Terms & Conditions */}
				<i>
					By continuing, you agree to our <Link to=''>terms & conditions</Link>
				</i>

				{/* Submit Button */}
				<button
					className='btn'
					type='submit'
					onClick={handleRegister}
					disabled={loading}
				>
					{loading ? 'Signing up...' : 'Sign up'}
				</button>
			</div>
			<div className='close' onClick={() => closeRegistrationModal()}>
				<span></span>
				<span></span>
			</div>
		</form>
	)
}

export default RegistrationForm

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginUserThunk } from '../../features/user/userSlice'
import ForgetPassword from '../../components/Forget-Password/ForgetPassword.jsx'

// Import images
import registrationImage from '../../assets/images/registration.png'
import fbImage from '../../assets/images/facebook-colored.svg'
import googleImage from '../../assets/images/google-colored.svg'
import appleImage from '../../assets/images/apple.svg'
import vkImage from '../../assets/images/vk-colored.svg'

export default function Login({
	closeLoginModal,
	openRegistrationModal,
	closeAllModals,
}) {
	// State for form
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rememberMe, setRememberMe] = useState(false)

	const [openForgetPasswordModal, setOpenForgetPasswordModal] = useState(false)

	const dispatch = useDispatch()

	const handleLogin = async e => {
		e.preventDefault()
		try {
			const resultAction = await dispatch(
				loginUserThunk({ email, password, rememberMe })
			)

			if (loginUserThunk.fulfilled.match(resultAction)) {
				// Show success toast
				toast.success('Logged in successfully!')
				// Close modal or redirect
				closeLoginModal && closeLoginModal()
			} else {
				toast.error(resultAction.payload || 'Login failed.')
			}
		} catch (err) {
			toast.error('Something went wrong during login.')
		}
	}

	// If user wants to go back from verification
	const handleBack = () => {
		setOpenForgetPasswordModal(false)
	}

	const handleOpenModal = () => {
		setOpenForgetPasswordModal(true)
	}

	return (
		<div className='registration login'>
			<div className='background' onClick={closeLoginModal}></div>
			{openForgetPasswordModal ? (
				<ForgetPassword
					defaultEmail={email}
					onBack={handleBack}
					closeAllModals={closeAllModals}
				/>
			) : (
				<div className='registration-container'>
					<div className='left'>
						<img src={registrationImage} alt='registration' />
					</div>
					<form className='right'>
						<h3>Sign in</h3>

						{/* Switch to Sign Up */}
						<div className='buttons'>
							<button
								type='button'
								className='btn'
								onClick={() => {
									closeLoginModal()
									openRegistrationModal()
								}}
							>
								Sign up
							</button>
							{/* We’ll use this button for sign in. */}
							<button type='button' className='btn' onClick={handleLogin}>
								Sign in
							</button>
						</div>

						{/* Social Sign in Buttons */}
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
								<img src={vkImage} alt='VK' />
							</button>
						</div>

						<div className='line'>
							<div className='left'></div>
							<p>or</p>
							<div className='right'></div>
						</div>

						{/* Email Input */}
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

						{/* Password Input */}
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

						{/* Remember Me & Forgot Password */}
						<div className='under'>
							<div className='left'>
								<input
									type='checkbox'
									id='confirm'
									checked={rememberMe}
									onChange={e => setRememberMe(e.target.checked)}
								/>
								<label htmlFor='confirm'>Remember me</label>
							</div>
							<div className='right'>
								<span onClick={() => handleOpenModal()} to=''>
									forgot password
								</span>
							</div>
						</div>

						<button type='submit' className='btn' onClick={handleLogin}>
							Sign in
						</button>
					</form>
					<div className='close' onClick={closeLoginModal}>
						<span></span>
						<span></span>
					</div>
				</div>
			)}
		</div>
	)
}

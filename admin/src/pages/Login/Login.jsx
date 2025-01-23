import React, { useState } from 'react'
import axios from '../../axiosInstance.js'
import './style/login.scss'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading.jsx'

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false) // Loading state

	const navigate = useNavigate()

	// Handle input changes
	const handleChange = e => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	// Client-side validation function
	const validateForm = () => {
		const { email, password } = formData
		const emailRegex = /^\S+@\S+\.\S+$/

		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address.')
			return false
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long.')
			return false
		}

		setError('')
		return true
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault()

		if (!validateForm()) return

		setLoading(true) // Start loading

		try {
			// Make a secure POST request to your backend login route
			const response = await axios.post(
				`/users/admin/login`,
				formData,
				{ withCredentials: true } // Include credentials (cookies)
			)

			if (response.status === 200) {
				// Handle successful login (e.g., redirect)
				const { message } = response.data
				toast.success(`${message} Redirecting to dashboard...`)
				navigate('/users')
			}
		} catch (err) {
			// Handle errors
			const errorMessage = err.response?.data?.message || 'Something went wrong'
			setError(errorMessage)
			toast.error(errorMessage)
		} finally {
			setLoading(false) // End loading
		}
	}

	return (
		<div className='login-container'>
			<form className='login-form' onSubmit={handleSubmit} noValidate>
				<h2>Admin Login</h2>
				{error && <div className='error-message'>{error}</div>}
				<label htmlFor='email'>
					Email:
					<input
						type='email' // Changed to 'email' type for validation
						name='email'
						id='email'
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</label>
				<label htmlFor='password'>
					Password:
					<input
						type='password'
						name='password'
						id='password'
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</label>
				<button type='submit' disabled={loading}>
					{loading ? <Loading white /> : 'Login'}
				</button>
			</form>
		</div>
	)
}

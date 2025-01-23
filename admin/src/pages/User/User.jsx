import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import './style/user.scss'
import Loading from '../../components/Loading.jsx'
import Select from 'react-select'

export default function User() {
	// Extract the 'id' parameter from the URL using useParams()
	const { id } = useParams()
	// State to store user data
	const [user, setUser] = useState(null)
	// State to indicate loading while fetching user data
	const [loading, setLoading] = useState(false)
	// State to store error message if any error occurs
	const [error, setError] = useState('')
	// State to store list of leagues
	const [leaguesList, setLeaguesList] = useState([])
	// State to store badges
	const [badges, setBadges] = useState(null)
	// State to store prizes
	const [prizes, setPrizes] = useState(null)
	// State to store form data
	const [formData, setFormData] = useState({
		role: '',
		firstName: '',
		lastName: '',
		email: '',
		dateOfBirth: '',
		dateOfRegistration: '',
		password: '',
		referralCode: '',
		referredByCode: '',
		leagues: [],
		referredPeople: [],
		status: '',
		lastLogin: '',
		paymentInformation: {},
		acceptedTerms: false,
		isVerified: false,
		verificationCode: '',
		codeExpires: '',
		paymentHistory: [],
		passwordUpdatedAt: '',
		badges: [],
		prizes: [],
		resetPasswordToken: '',
		resetPasswordExpires: '',
		failedLoginAttempts: 0,
		lastFailedLogin: '',
		isLocked: false,
		isDeleted: false,
		settings: {
			preferredLanguage: '',
			wantsNotifications: false,
		},
	})

	const navigate = useNavigate() // Hook to navigate programmatically

	// useEffect to fetch leagues and user data initially
	useEffect(() => {
		fetchLeaguesAndBadgesAndPrizes() // Fetch leagues
		if (id) {
			// If 'id' is present, fetch user data
			fetchUser()
		}
	}, [id])

	// Function to fetch leagues
	const fetchLeaguesAndBadgesAndPrizes = async () => {
		try {
			const { data } = await axiosInstance.get('/leagues/all-names') // Fetch leagues from the server
			const badgeData = await axiosInstance.get(`/user-leagues/badge/all`)
			const prizeData = await axiosInstance.get(`/user-leagues/prize/all`)
			setLeaguesList(data) // Set the fetched leagues to state
			setBadges(badgeData.data)
			setPrizes(prizeData.data)
		} catch (err) {
			toast.error('Failed to fetch leagues.') // Display error message if fetching fails
		}
	}

	// Function to fetch user data if 'id' is present
	const fetchUser = async () => {
		setLoading(true) // Set loading state to true while fetching
		try {
			const { data } = await axiosInstance.get(`/users/admin/${id}`) // Fetch user data using the ID
			setUser(data) // Set the fetched user data to state
			// Set form data with fetched user data
			setFormData({
				role: data.role || '',
				firstName: data.firstName || '',
				lastName: data.lastName || '',
				email: data.email || '',
				dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : '',
				dateOfRegistration: data.dateOfRegistration
					? data.dateOfRegistration.substring(0, 10)
					: '',
				password: '',
				referralCode: data.referralCode || '',
				referredByCode: data.referredByCode || '',
				leagues: data.leagues || [],
				referredPeople: data.referredPeople || [],
				status: data.status || '',
				lastLogin: data.lastLogin ? data.lastLogin.substring(0, 10) : '',
				paymentInformation: data.paymentInformation || {},
				acceptedTerms: data.acceptedTerms || false,
				isVerified: data.isVerified || false,
				isDeleted: data.isDeleted || false,
				verificationCode: data.verificationCode || '',
				codeExpires: data.codeExpires ? data.codeExpires.substring(0, 10) : '',
				paymentHistory: data.paymentHistory || [],
				passwordUpdatedAt: data.passwordUpdatedAt
					? data.passwordUpdatedAt.substring(0, 10)
					: '',
				badges: data.badges || [],
				prizes: data.prizes || [],
				resetPasswordToken: data.resetPasswordToken || '',
				resetPasswordExpires: data.resetPasswordExpires
					? data.resetPasswordExpires.substring(0, 10)
					: '',
				failedLoginAttempts: data.failedLoginAttempts || 0,
				lastFailedLogin: data.lastFailedLogin
					? data.lastFailedLogin.substring(0, 10)
					: '',
				isLocked: data.isLocked || false,
				settings: data.settings || {
					preferredLanguage: '',
					wantsNotifications: false,
				},
			})
			setLoading(false) // Set loading state to false after fetching
		} catch (err) {
			setError('Failed to fetch user.') // Set error state if fetching fails
			setLoading(false) // Set loading state to false after error
			toast.error('Failed to fetch user.') // Display error message
		}
	}

	// Handle changes in form inputs
	const handleChange = e => {
		const { name, value, type, checked } = e.target // Extract name, value, type, and checked from the input field

		if (name.startsWith('settings.')) {
			// Handle changes in settings fields
			const settingKey = name.split('.')[1]
			setFormData(prevData => ({
				...prevData,
				settings: {
					...prevData.settings,
					[settingKey]: type === 'checkbox' ? checked : value,
				},
			}))
		} else if (type === 'checkbox') {
			if (name === 'leagues') {
				// Handle adding/removing league IDs
				if (checked) {
					// Add league ID
					setFormData(prevData => ({
						...prevData,
						leagues: [...prevData.leagues, value],
					}))
				} else {
					// Remove league ID
					setFormData(prevData => ({
						...prevData,
						leagues: prevData.leagues.filter(leagueId => leagueId !== value),
					}))
				}
			} else {
				// Handle other checkboxes
				setFormData(prevData => ({
					...prevData,
					[name]: checked,
				}))
			}
		} else if (
			['referredPeople', 'paymentHistory', 'badges', 'prizes'].includes(name)
		) {
			// Handle textareas that represent arrays
			setFormData(prevData => ({
				...prevData,
				[name]: value.split('\n').filter(v => v.trim() !== ''),
			}))
		} else if (name === 'paymentInformation') {
			// Handle paymentInformation as JSON
			try {
				const parsedValue = JSON.parse(value)
				setFormData(prevData => ({
					...prevData,
					paymentInformation: parsedValue,
				}))
			} catch (error) {
				console.error('Invalid JSON in payment information')
				toast.error('Invalid JSON in payment information')
			}
		} else {
			// Handle other inputs
			setFormData(prevData => ({
				...prevData,
				[name]: value,
			}))
		}
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault() // Prevent default form submission behavior
		try {
			if (id) {
				// If 'id' is present, update existing user
				await axiosInstance.put(`/users/admin/${id}`, formData)
				toast.success('User updated successfully.') // Display success message
			} else {
				// If no 'id', create new user
				await axiosInstance.post('/users/admin/create-user', formData)
				toast.success('User created successfully.') // Display success message
			}
			navigate('/users') // Navigate to users page after successful submission
		} catch (err) {
			// Handle error during submission
			if (err.response && err.response.data.message) {
				toast.error(err.response.data.message) // Display specific error message from server
			} else {
				toast.error('Failed to submit user.') // Display generic error message
			}
		}
	}

	if (loading) {
		// Display loading state if data is still being fetched
		return (
			<div className='dfjccaic user-page'>
				<Loading />
			</div>
		)
	}

	if (error) {
		// Display error message if error state is set
		return <div className='error-message'>{error}</div>
	}

	return (
		<div className='user-page'>
			{/* Show 'Edit User' or 'Create User' based on presence of 'id' */}
			<h1 className='title'>{id ? 'Edit User' : 'Create User'}</h1>
			<form className='user-form' onSubmit={handleSubmit}>
				{/* First Name */}
				<div className='form-group'>
					<label>First Name:</label>
					<input
						type='text'
						name='firstName'
						value={formData.firstName}
						onChange={handleChange}
					/>
				</div>

				{/* Last Name */}
				<div className='form-group'>
					<label>Last Name:</label>
					<input
						type='text'
						name='lastName'
						value={formData.lastName}
						onChange={handleChange}
					/>
				</div>

				{/* Email */}
				<div className='form-group'>
					<label>Email:</label>
					<input
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Password */}
				<div className='form-group'>
					<label>{id ? 'New Password:' : 'Password:'}</label>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						placeholder={id ? 'Leave blank to keep current password' : ''}
						required={!id} // Required when creating a new user
					/>
				</div>

				{/* Date of Birth */}
				<div className='form-group'>
					<label>Date of Birth:</label>
					<input
						type='date'
						name='dateOfBirth'
						value={
							formData.dateOfBirth
								? new Date(formData.dateOfBirth).toISOString().split('T')[0]
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Date of Registration */}
				<div className='form-group'>
					<label>Date of Registration:</label>
					<input
						type='date'
						name='dateOfRegistration'
						value={
							formData.dateOfRegistration
								? new Date(formData.dateOfRegistration)
										.toISOString()
										.split('T')[0]
								: ''
						}
						onChange={handleChange}
						disabled={id} // Disable editing date of registration when editing user
					/>
				</div>

				{/* Role */}
				<div className='form-group'>
					<label>Role:</label>
					<select
						name='role'
						value={formData.role}
						onChange={handleChange}
						required
					>
						<option value=''>Select Role</option>
						<option value='registered'>Registered</option>
						<option value='premium'>Premium</option>
						<option value='super-admin'>Super Admin</option>
					</select>
				</div>

				{/* Status */}
				<div className='form-group'>
					<label>Status:</label>
					<select
						name='status'
						value={formData.status}
						onChange={handleChange}
						required
					>
						<option value=''>Select Status</option>
						<option value='active'>Active</option>
						<option value='suspended'>Suspended</option>
						<option value='deactivated'>Deactivated</option>
					</select>
				</div>

				{/* Verified */}
				<div className='form-group'>
					<label>Verified:</label>
					<input
						type='checkbox'
						name='isVerified'
						checked={formData.isVerified}
						onChange={handleChange}
					/>
				</div>

				{/* Is Locked */}
				<div className='form-group'>
					<label>Is Locked:</label>
					<input
						type='checkbox'
						name='isLocked'
						checked={formData.isLocked}
						onChange={handleChange}
						disabled
					/>
				</div>

				{/* Is Deleted */}
				<div className='form-group'>
					<label>Is Deleted:</label>
					<input
						type='checkbox'
						name='isDeleted'
						checked={formData.isDeleted}
						onChange={handleChange}
					/>
				</div>

				{/* Accepted Terms */}
				<div className='form-group'>
					<label>Accepted Terms:</label>
					<input
						type='checkbox'
						name='acceptedTerms'
						checked={formData.acceptedTerms}
						onChange={handleChange}
					/>
				</div>

				{/* Preferred Language */}
				<div className='form-group'>
					<label>Preferred Language:</label>
					<select
						name='settings.preferredLanguage'
						value={formData.settings.preferredLanguage}
						onChange={handleChange}
					>
						<option value=''>Select Language</option>
						<option value='en'>English</option>
						<option value='am'>Armenian</option>
						<option value='ru'>Russian</option>
					</select>
				</div>

				{/* Wants Notifications */}
				<div className='form-group'>
					<label>Wants Notifications:</label>
					<input
						type='checkbox'
						name='settings.wantsNotifications'
						checked={formData.settings.wantsNotifications}
						onChange={handleChange}
					/>
				</div>

				{/* Referral Code */}
				<div className='form-group'>
					<label>Referral Code:</label>
					<input
						type='text'
						name='referralCode'
						value={formData.referralCode}
						onChange={handleChange}
					/>
				</div>

				{/* Referred By Code */}
				<div className='form-group'>
					<label>Referred By Code:</label>
					<input
						type='text'
						name='referredByCode'
						value={formData.referredByCode}
						onChange={handleChange}
					/>
				</div>

				{/* Leagues */}
				<div className='form-group league-group'>
					<label>Leagues:</label>
					<div className='checkbox-group league-checkboxes'>
						{leaguesList.map(league => (
							<div key={league._id} className='league-checkbox'>
								<input
									type='checkbox'
									name='leagues'
									value={league._id}
									checked={formData.leagues.includes(league._id)}
									onChange={handleChange}
									id={league._id}
								/>

								<Link
									className='user-league-link'
									to={'/user-league/' + league?._id + '/' + user?._id}
								>
									<label htmlFor={league._id}>{league.leagueName}</label>
								</Link>
							</div>
						))}
					</div>
				</div>

				{/* Referred People */}
				<div className='form-group'>
					<label>Referred People:</label>
					<textarea
						name='referredPeople'
						value={formData.referredPeople.join('\n')}
						onChange={handleChange}
						placeholder='Enter user IDs, one per line'
					/>
				</div>

				{/* Last Login */}
				<div className='form-group'>
					<label>Last Login:</label>
					<input
						type='date'
						name='lastLogin'
						value={
							formData.lastLogin
								? new Date(formData.lastLogin).toISOString().split('T')[0]
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Payment Information */}
				<div className='form-group'>
					<label>Payment Information:</label>
					<textarea
						name='paymentInformation'
						value={JSON.stringify(formData.paymentInformation, null, 2)}
						onChange={handleChange}
						placeholder='Enter JSON for payment information'
					/>
				</div>

				{/* Verification Code */}
				<div className='form-group'>
					<label>Verification Code:</label>
					<input
						type='text'
						name='verificationCode'
						value={formData.verificationCode}
						onChange={handleChange}
					/>
				</div>

				{/* Code Expires */}
				<div className='form-group'>
					<label>Code Expires:</label>
					<input
						type='date'
						name='codeExpires'
						value={
							formData.codeExpires
								? new Date(formData.codeExpires).toISOString().split('T')[0]
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Payment History */}
				<div className='form-group'>
					<label>Payment History:</label>
					<textarea
						name='paymentHistory'
						value={formData.paymentHistory.join('\n')}
						onChange={handleChange}
						placeholder='Enter payment IDs, one per line'
					/>
				</div>

				{/* Password Updated At */}
				<div className='form-group'>
					<label>Password Updated At:</label>
					<input
						type='date'
						name='passwordUpdatedAt'
						value={
							formData.passwordUpdatedAt
								? new Date(formData.passwordUpdatedAt)
										.toISOString()
										.split('T')[0]
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Badges */}
				<div className='form-group'>
					<label>Badges:</label>
					<Select
						isMulti
						name='badges'
						value={badges?.badges
							.filter(badge => formData.badges.includes(badge._id))
							.map(badge => ({
								value: badge._id,
								label: badge.name,
							}))}
						options={badges?.badges?.map(badge => ({
							value: badge._id,
							label: badge.name,
						}))}
						onChange={selectedOptions => {
							setFormData(prevData => ({
								...prevData,
								badges: selectedOptions.map(option => option.value),
							}))
						}}
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Prize */}
				<div className='form-group'>
					<label>Prizes:</label>
					<Select
						isMulti
						name='prizes'
						value={prizes?.prizes
							.filter(prize => formData.prizes.includes(prize._id))
							.map(prize => ({
								value: prize._id,
								label: prize.title,
							}))}
						options={prizes?.prizes?.map(prize => ({
							value: prize._id,
							label: prize.title,
						}))}
						onChange={selectedOptions => {
							setFormData(prevData => ({
								...prevData,
								prizes: selectedOptions.map(option => option.value),
							}))
						}}
						className='basic-multi-select'
						classNamePrefix='select'
					/>
				</div>

				{/* Reset Password Token */}
				<div className='form-group'>
					<label>Reset Password Token:</label>
					<input
						type='text'
						name='resetPasswordToken'
						value={formData.resetPasswordToken}
						onChange={handleChange}
					/>
				</div>

				{/* Reset Password Expires */}
				<div className='form-group'>
					<label>Reset Password Expires:</label>
					<input
						type='date'
						name='resetPasswordExpires'
						value={
							formData.resetPasswordExpires
								? new Date(formData.resetPasswordExpires)
										.toISOString()
										.split('T')[0]
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Failed Login Attempts */}
				<div className='form-group'>
					<label>Failed Login Attempts:</label>
					<input
						type='number'
						name='failedLoginAttempts'
						value={formData.failedLoginAttempts}
						onChange={handleChange}
					/>
				</div>

				{/* Last Failed Login */}
				<div className='form-group'>
					<label>Last Failed Login:</label>
					<input
						type='date'
						name='lastFailedLogin'
						value={
							formData.lastFailedLogin
								? new Date(formData.lastFailedLogin).toISOString().split('T')[0]
								: ''
						}
						onChange={handleChange}
					/>
				</div>

				{/* Save Button */}
				<button type='submit' className='btn btn-save'>
					{id ? 'Save Changes' : 'Create User'}
				</button>
			</form>
		</div>
	)
}

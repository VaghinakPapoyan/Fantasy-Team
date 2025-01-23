import axios from 'axios'
// Import a notification library like react-toastify
import { toast } from 'react-toastify'

// Initialize the notification library (if not done elsewhere)
import 'react-toastify/dist/ReactToastify.css'

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/',
	withCredentials: true, // Include cookies in requests
})

// Removed the request interceptor since we're using httpOnly cookies

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (
			error.response &&
			(error.response.status === 401 || error.response.status === 400)
		) {
			// Display a user-friendly error notification
			toast.error('Session expired. Please log in again.')

			// Redirect to the login page
			setTimeout(() => {
				// window.location.href = '/login'
			}, 10000)
		}
		return Promise.reject(error)
	}
)

export default axiosInstance

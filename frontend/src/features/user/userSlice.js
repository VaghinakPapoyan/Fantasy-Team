import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '../../services/authService'

export const requestPasswordResetThunk = createAsyncThunk(
	'auth/requestPasswordReset',
	async (email, { rejectWithValue }) => {
		try {
			const data = await authService.requestPasswordReset(email)
			return data // e.g. { message: 'Password reset link has been sent.' }
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message ||
				error.message ||
				'Failed to request password reset.'
			return rejectWithValue(errorMessage)
		}
	}
)

export const resetPasswordThunk = createAsyncThunk(
	'auth/resetPassword',
	async ({ token, password }, { rejectWithValue }) => {
		try {
			const data = await authService.resetPassword(token, password)
			return data // e.g. { message: 'Password has been reset successfully.' }
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message ||
				error.message ||
				'Failed to reset password.'
			return rejectWithValue(errorMessage)
		}
	}
)

/**
 * Registers a user.
 * - The backend does NOT return user data yet, so we just capture success/failure.
 */
export const registerUserThunk = createAsyncThunk(
	'user/registerUser',
	async (userData, { rejectWithValue }) => {
		try {
			// Example response: { code: "1234", message: "Check email" }
			const responseData = await authService.registerUser(userData)
			return responseData
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message ||
				error.message ||
				'Registration failed.'
			return rejectWithValue(errorMessage)
		}
	}
)

/**
 * Logs in a user.
 * - The backend call sets an HTTP-only cookie (or session) but does NOT return user data.
 * - After login, we separately fetchAccount() to retrieve user info.
 */
export const loginUserThunk = createAsyncThunk(
	'user/loginUser',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			// This call only logs in (sets session cookie). It does NOT return user data.
			await authService.loginUser({ email, password })

			// Now fetch the user account from the /api/v1/users/account endpoint
			const user = await authService.getAccount()
			return user
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message || error.message || 'Login failed.'
			return rejectWithValue(errorMessage)
		}
	}
)

/**
 * Verifies the user's email.
 * - Once verified, we fetch the user from the account endpoint.
 */
export const verifyUserThunk = createAsyncThunk(
	'user/verifyUser',
	async ({ email, verificationCode }, { rejectWithValue }) => {
		try {
			// This call just verifies the code, but does NOT return user data.
			await authService.verifyEmail({ email, verificationCode })

			// After success, fetch the user from /api/v1/users/account
			const user = await authService.getAccount()
			return user // now we have the verified user
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message ||
				error.message ||
				'Verification failed.'
			return rejectWithValue(errorMessage)
		}
	}
)

/**
 * Resend verification code, if needed.
 */
export const resendVerificationThunk = createAsyncThunk(
	'user/resendVerification',
	async ({ email }, { rejectWithValue }) => {
		try {
			// e.g., { message: 'Verification code resent.' }
			const response = await authService.resendVerification({ email })
			return response
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message ||
				error.message ||
				'Failed to resend code.'
			return rejectWithValue(errorMessage)
		}
	}
)

/**
 * Optional: Fetch account if your backend uses an HTTP-only cookie.
 * - Typically called on page load to restore user data.
 */
export const fetchAccountThunk = createAsyncThunk(
	'user/fetchAccount',
	async (_, { rejectWithValue }) => {
		try {
			const user = await authService.getAccount()
			return user
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message ||
				error.message ||
				'Failed to fetch user account.'
			return rejectWithValue(errorMessage)
		}
	}
)

// INITIAL STATE
const initialState = {
	user: null, // user data if logged in/verified
	loading: false, // global loading for user actions
	error: null, // global error message
	registerSuccess: false, // track if registration succeeded
	verificationSuccess: false, // track if verification succeeded
	message: null,
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// Clear user from Redux (logout).
		// If your backend uses cookies, call an API to clear the session cookie, too.
		logoutUser(state) {
			state.user = null
			state.error = null
			state.loading = false
		},

		clearAuthMessages: state => {
			state.error = null
			state.message = null
		},
	},
	extraReducers: builder => {
		builder
			// ===== registerUserThunk =====
			.addCase(registerUserThunk.pending, state => {
				state.loading = true
				state.error = null
				state.registerSuccess = false
			})
			.addCase(registerUserThunk.fulfilled, (state, action) => {
				state.loading = false
				state.registerSuccess = true
			})
			.addCase(registerUserThunk.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
				state.registerSuccess = false
			})

			// ===== loginUserThunk =====
			.addCase(loginUserThunk.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(loginUserThunk.fulfilled, (state, action) => {
				state.loading = false
				// The payload is the user we fetched from /account
				state.user = action.payload
			})
			.addCase(loginUserThunk.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// ===== verifyUserThunk =====
			.addCase(verifyUserThunk.pending, state => {
				state.loading = true
				state.error = null
				state.verificationSuccess = false
			})
			.addCase(verifyUserThunk.fulfilled, (state, action) => {
				state.loading = false
				// The payload is the verified user from /account
				state.user = action.payload
				state.verificationSuccess = true
			})
			.addCase(verifyUserThunk.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
				state.verificationSuccess = false
			})

			// ===== resendVerificationThunk =====
			.addCase(resendVerificationThunk.pending, state => {
				// Optionally track a resend loading state
			})
			.addCase(resendVerificationThunk.fulfilled, (state, action) => {
				// Maybe store a success message or boolean
			})
			.addCase(resendVerificationThunk.rejected, (state, action) => {
				state.error = action.payload
			})

			// ===== fetchAccountThunk (optional) =====
			.addCase(fetchAccountThunk.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchAccountThunk.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
			})
			.addCase(fetchAccountThunk.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// REQUEST PASSWORD RESET
			.addCase(requestPasswordResetThunk.pending, state => {
				state.loading = true
				state.error = null
				state.message = null
			})
			.addCase(requestPasswordResetThunk.fulfilled, (state, action) => {
				state.loading = false
				state.message = action.payload.message // e.g. "Password reset link has been sent."
			})
			.addCase(requestPasswordResetThunk.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// RESET PASSWORD
			.addCase(resetPasswordThunk.pending, state => {
				state.loading = true
				state.error = null
				state.message = null
			})
			.addCase(resetPasswordThunk.fulfilled, (state, action) => {
				state.loading = false
				state.message = action.payload.message
			})
			.addCase(resetPasswordThunk.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})

export const { logoutUser, clearAuthMessages } = userSlice.actions
export default userSlice.reducer

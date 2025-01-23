// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.js'

export const store = configureStore({
	reducer: {
		user: userReducer,
	},
})

export default store

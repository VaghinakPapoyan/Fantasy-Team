import React from 'react'
import AdminRoutes from './pages/routes.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './components/style.scss'

function App() {
	return (
		<div className='App'>
			<ToastContainer />
			<AdminRoutes />
		</div>
	)
}

export default App

import React from 'react'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error) {
		// Update state to show fallback UI on next render
		return { hasError: true }
	}

	componentDidCatch(error, info) {
		// You can log error info to an error reporting service
		console.error('ErrorBoundary caught an error', error, info)
	}

	render() {
		if (this.state.hasError) {
			// Fallback UI
			return <h1>Something went wrong.</h1>
		}

		return this.props.children
	}
}

export default ErrorBoundary

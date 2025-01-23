import React, { useState } from 'react'
import axiosInstance from '../../axiosInstance.js'
import Loader from '../../components/Loading.jsx' // Adjust the import path based on your project structure
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function GenerateEmblem() {
	const [formData, setFormData] = useState({
		colorScheme: '',
		slogan: '',
		favoriteEmblem: '',
		additionalInput: '',
		shape: '',
		symbol: '',
	})

	const [imageUrl, setImageUrl] = useState('')
	const [imageBase64, setImageBase64] = useState('')
	const [isGenerating, setIsGenerating] = useState(false)

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	const validateForm = () => {
		const { colorScheme, slogan, shape, symbol } = formData
		if (!colorScheme || !slogan || !shape || !symbol) {
			toast.warn('Please fill in all required fields.')
			return false
		}
		return true
	}

	const handleCreate = async () => {
		if (!validateForm()) return

		setIsGenerating(true)
		try {
			const {
				colorScheme,
				slogan,
				favoriteEmblem,
				additionalInput,
				shape,
				symbol,
			} = formData

			const prompt = `Design a professional soccer team emblem with the following specifications:
- **Color Scheme**: ${colorScheme}
- **Slogan**: "${slogan}" (max 10 characters)
- **Favorite Emblem Reference**: ${favoriteEmblem}
- **Additional Input**: ${additionalInput}
- **Shape**: ${shape}
- **Symbol**: ${symbol}

Ensure the emblem is high-quality, appropriate, and adheres strictly to the above details. Do not include any unrelated elements or text.`

			const response = await axiosInstance.post(
				'/user-leagues/generate-emblem',
				{
					prompt,
				}
			)

			if (response.data.success) {
				setImageBase64(response.data.imageBase64)
				setImageUrl('data:image/png;base64,' + response.data.imageBase64)
				toast.success('Emblem generated successfully!')
			} else {
				toast.error('Failed to generate emblem. Please try again.')
			}
		} catch (error) {
			console.error('Error generating emblem:', error)
			const errorMsg =
				error.response?.data?.error ||
				'An error occurred while generating the emblem.'
			toast.error(errorMsg)
		}
		setIsGenerating(false)
	}

	const handleSubmit = async () => {
		if (!imageBase64) {
			toast.warn('No emblem to save. Please generate an emblem first.')
			return
		}
		try {
			const response = await axiosInstance.post('/user-leagues/save-emblem', {
				imageBase64,
			})
			if (response.data.success) {
				toast.success('Emblem saved successfully!')
			} else {
				toast.error('Failed to save emblem.')
			}
		} catch (error) {
			console.error('Error saving emblem:', error)
			const errorMsg =
				error.response?.data?.error ||
				'An error occurred while saving the emblem.'
			toast.error(errorMsg)
		}
	}

	return (
		<div className='generate-emblem'>
			<h1>Soccer Team Emblem Generator</h1>
			<form>
				<label>
					Color Scheme:
					<input
						type='text'
						name='colorScheme'
						value={formData.colorScheme}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Slogan (max 10 chars):
					<input
						type='text'
						name='slogan'
						value={formData.slogan}
						maxLength={10}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Favorite Emblem Reference:
					<input
						type='text'
						name='favoriteEmblem'
						value={formData.favoriteEmblem}
						onChange={handleChange}
					/>
				</label>
				<br />
				<label>
					Additional Input:
					<input
						type='text'
						name='additionalInput'
						value={formData.additionalInput}
						onChange={handleChange}
					/>
				</label>
				<br />
				<label>
					Shape:
					<input
						type='text'
						name='shape'
						value={formData.shape}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
				<label>
					Symbol:
					<input
						type='text'
						name='symbol'
						value={formData.symbol}
						onChange={handleChange}
						required
					/>
				</label>
				<br />
			</form>
			{isGenerating && <Loader />}
			<div className='dfjcc'>
				<button onClick={handleCreate} disabled={isGenerating}>
					{isGenerating ? 'Generating...' : 'Create'}
				</button>
				<button onClick={handleSubmit} disabled={!imageUrl}>
					Submit
				</button>
			</div>

			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
			/>

			{imageUrl && (
				<div>
					<h2>Your Generated Emblem:</h2>
					<img
						src={imageUrl}
						alt='Generated Emblem'
						style={{ maxWidth: '100%' }}
					/>
				</div>
			)}
		</div>
	)
}

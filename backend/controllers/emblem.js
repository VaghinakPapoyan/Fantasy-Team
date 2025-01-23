// import axios from 'axios'

// async function generateImageWithRetry(prompt, retries = 3, delay = 2000) {
// 	for (let attempt = 1; attempt <= retries; attempt++) {
// 		try {
// 			const response = await axios.post(
// 				'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
// 				{
// 					inputs: prompt,
// 					parameters: {
// 						width: 128,
// 						height: 128,
// 					},
// 				},
// 				{
// 					headers: {
// 						Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
// 						'Content-Type': 'application/json',
// 					},
// 					responseType: 'arraybuffer',
// 				}
// 			)
// 			return response
// 		} catch (error) {
// 			if (attempt === retries) throw error
// 			console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`)
// 			await new Promise(resolve => setTimeout(resolve, delay))
// 			delay *= 2 // Exponential backoff
// 		}
// 	}
// }

// export async function generateEmblem(req, res) {
// 	const { prompt } = req.body
// 	try {
// 		const response = await generateImageWithRetry(prompt)
// 		const base64Image = Buffer.from(response.data).toString('base64')
// 		res.json({ success: true, imageBase64: base64Image })
// 	} catch (error) {
// 		console.error('Error generating image:', error)
// 		const errorMessage = error.response?.data
// 			? Buffer.from(error.response.data).toString()
// 			: error.message
// 		res.status(error.response?.status || 500).json({
// 			success: false,
// 			error: 'Error generating image',
// 			details: errorMessage,
// 		})
// 	}
// }

// export async function submitEmblem(req, res) {
// 	const { imageBase64 } = req.body

// 	try {
// 		// Example: Save to local file system
// 		const fileName = `emblem-${Date.now()}.png`
// 		const filePath = `uploads/${fileName}`

// 		await saveBase64AsFile(imageBase64, filePath)

// 		res.json({
// 			success: true,
// 			message: 'Emblem saved successfully!',
// 			path: `/uploads/${fileName}`,
// 		})
// 	} catch (error) {
// 		console.error('Error saving emblem:', error)
// 		res.status(500).json({
// 			success: false,
// 			error: 'Error saving emblem',
// 			details: error.message,
// 		})
// 	}
// }

// // Helper function to save base64 as file
// function saveBase64AsFile(base64Data, filePath) {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			const buffer = Buffer.from(base64Data, 'base64')
// 			require('fs').writeFileSync(filePath, buffer)
// 			resolve(filePath)
// 		} catch (error) {
// 			reject(error)
// 		}
// 	})
// }

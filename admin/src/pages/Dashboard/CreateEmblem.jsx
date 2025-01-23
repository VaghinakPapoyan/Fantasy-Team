import React, { useState, useRef } from 'react'
import {
	Stage,
	Layer,
	Rect,
	Circle,
	Text,
	Image as KonvaImage,
} from 'react-konva'

const CreateEmblem = () => {
	const [shapes, setShapes] = useState([])
	const [texts, setTexts] = useState([])
	const [images, setImages] = useState([])
	const stageRef = useRef()
	const fileInputRef = useRef()

	// Add a rectangle
	const addRectangle = () => {
		const newRect = {
			id: `rect${shapes.length + 1}`,
			x: 50,
			y: 50,
			width: 100,
			height: 100,
			fill: 'green',
			draggable: true,
		}
		setShapes([...shapes, newRect])
	}

	// Add a circle
	const addCircle = () => {
		const newCircle = {
			id: `circle${shapes.length + 1}`,
			x: 150,
			y: 150,
			radius: 50,
			fill: 'blue',
			draggable: true,
			type: 'circle',
		}
		setShapes([...shapes, newCircle])
	}

	// Add text
	const addText = () => {
		const newText = {
			id: `text${texts.length + 1}`,
			x: 100,
			y: 100,
			text: 'Your Text Here',
			fontSize: 24,
			draggable: true,
		}
		setTexts([...texts, newText])
	}

	// Handle file input change for image upload
	const handleFileChange = e => {
		const file = e.target.files[0]
		const reader = new FileReader()
		reader.onload = () => {
			const img = new window.Image()
			img.src = reader.result
			img.onload = () => {
				setImages([
					...images,
					{
						id: `img${images.length + 1}`,
						img: img,
						x: 50,
						y: 50,
						draggable: true,
					},
				])
			}
		}
		if (file) {
			reader.readAsDataURL(file)
		}
	}

	const addImage = () => {
		fileInputRef.current.click()
	}

	// Export canvas as an image
	const handleExport = () => {
		const uri = stageRef.current.toDataURL()
		const link = document.createElement('a')
		link.download = 'football_logo.png'
		link.href = uri
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<div className='logo-creator'>
			<div style={{ marginBottom: '10px' }}>
				<button onClick={addRectangle}>Add Rectangle</button>
				<button onClick={addCircle}>Add Circle</button>
				<button onClick={addText}>Add Text</button>
				<button onClick={addImage}>Upload Image</button>
				<button onClick={handleExport}>Export Logo</button>
			</div>
			<input
				type='file'
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
			<Stage
				width={800}
				height={600}
				ref={stageRef}
				style={{ border: '1px solid black' }}
			>
				<Layer>
					{/* Render shapes */}
					{shapes.map(shape =>
						shape.type === 'circle' ? (
							<Circle
								key={shape.id}
								{...shape}
								onDragEnd={e => {
									const updatedShapes = shapes.map(s =>
										s.id === shape.id
											? { ...s, x: e.target.x(), y: e.target.y() }
											: s
									)
									setShapes(updatedShapes)
								}}
							/>
						) : (
							<Rect
								key={shape.id}
								{...shape}
								onDragEnd={e => {
									const updatedShapes = shapes.map(s =>
										s.id === shape.id
											? { ...s, x: e.target.x(), y: e.target.y() }
											: s
									)
									setShapes(updatedShapes)
								}}
							/>
						)
					)}

					{/* Render texts */}
					{texts.map(text => (
						<Text
							key={text.id}
							{...text}
							onDragEnd={e => {
								const updatedTexts = texts.map(t =>
									t.id === text.id
										? { ...t, x: e.target.x(), y: e.target.y() }
										: t
								)
								setTexts(updatedTexts)
							}}
							onDblClick={() => {
								const newText = prompt('Enter new text:', text.text)
								if (newText !== null) {
									setTexts(
										texts.map(t =>
											t.id === text.id ? { ...t, text: newText } : t
										)
									)
								}
							}}
						/>
					))}

					{/* Render images */}
					{images.map(image => (
						<KonvaImage
							key={image.id}
							image={image.img}
							x={image.x}
							y={image.y}
							draggable
							onDragEnd={e => {
								const updatedImages = images.map(img =>
									img.id === image.id
										? { ...img, x: e.target.x(), y: e.target.y() }
										: img
								)
								setImages(updatedImages)
							}}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	)
}

export default CreateEmblem

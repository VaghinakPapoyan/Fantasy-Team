import React, { useState } from 'react'
import EmblemPreview from './EmblemPreview'
import CreateEmblem from './CreateEmblem'
import GenerateEmblem from './GenerateEmblem'
import './style.scss'

const EmblemConstructor = () => {
	// Shape and Size
	const [shape, setShape] = useState('hexagon')

	// Colors
	const [colorScheme, setColorScheme] = useState('#FFD700')
	const [gradientStart, setGradientStart] = useState('#FFD700')
	const [gradientEnd, setGradientEnd] = useState('#FF8C00')
	const [useGradient, setUseGradient] = useState(false)
	const [background, setBackground] = useState('#FFFFFF')

	// Border and Outline
	const [borderWidth, setBorderWidth] = useState(2)
	const [borderColor, setBorderColor] = useState('#000000')

	// Patterns
	const [pattern, setPattern] = useState('none')
	const [patternColor, setPatternColor] = useState('#FFFFFF')
	const [customPattern, setCustomPattern] = useState(null)

	// Accent Elements
	const [accentElements, setAccentElements] = useState([])
	const availableIcons = [
		'star',
		'lion',
		'eagle',
		'crown',
		'sword',
		'flame',
		'lightning',
		'wolf',
		'tiger',
		'dragon',
		'laurel',
	]

	// Text Customization
	const [texts, setTexts] = useState([])

	// Handle File Uploads
	const handlePatternUpload = e => {
		const file = URL.createObjectURL(e.target.files[0])
		setCustomPattern(file)
	}

	const handleAccentUpload = (e, index) => {
		const file = URL.createObjectURL(e.target.files[0])
		const updatedElements = [...accentElements]
		updatedElements[index].customAccent = file
		setAccentElements(updatedElements)
	}

	return (
		<div className='emblem-constructor'>
			<h2>Create Your Emblem</h2>
			<div className='controls'>
				{/* Left Column */}
				<div className='inputs-column'>
					{/* Shape Selection */}
					<label>
						Shape:
						<select value={shape} onChange={e => setShape(e.target.value)}>
							<option value='hexagon'>Hexagon</option>
							<option value='circle'>Circle</option>
							<option value='shield'>Shield</option>
							<option value='square'>Square</option>
							<option value='pentagon'>Pentagon</option>
							<option value='diamond'>Diamond</option>
							<option value='triangle'>Triangle</option>
							<option value='oval'>Oval</option>
							<option value='star'>Star</option>
							<option value='cross'>Cross</option>
							<option value='shield-rounded'>Shield Rounded</option>
							<option value='crest'>Crest</option>
							<option value='rounded-square'>Rounded Square</option>
							<option value='flame'>Flame</option>
							<option value='badge'>Badge</option>
							<option value='circular-shield'>Circular Shield</option>
							<option value='leaf'>Leaf</option>
							<option value='arrowhead'>Arrowhead</option>
						</select>
					</label>

					{/* Use Gradient */}
					<label>
						Use Gradient:
						<input
							type='checkbox'
							checked={useGradient}
							onChange={e => setUseGradient(e.target.checked)}
						/>
					</label>

					{/* Color Scheme */}
					{!useGradient && (
						<label>
							Color Scheme:
							<input
								type='color'
								value={colorScheme}
								onChange={e => setColorScheme(e.target.value)}
							/>
						</label>
					)}

					{/* Gradient Colors */}
					{useGradient && (
						<>
							<label>
								Gradient Start Color:
								<input
									type='color'
									value={gradientStart}
									onChange={e => setGradientStart(e.target.value)}
								/>
							</label>
							<label>
								Gradient End Color:
								<input
									type='color'
									value={gradientEnd}
									onChange={e => setGradientEnd(e.target.value)}
								/>
							</label>
						</>
					)}

					{/* Background */}
					<label>
						Background Color:
						<input
							type='color'
							value={background}
							onChange={e => setBackground(e.target.value)}
						/>
					</label>

					{/* Border Width */}
					<label>
						Border Width:
						<input
							type='number'
							value={borderWidth}
							onChange={e => setBorderWidth(e.target.value)}
							min='0'
							max='10'
						/>
					</label>

					{/* Border Color */}
					<label>
						Border Color:
						<input
							type='color'
							value={borderColor}
							onChange={e => setBorderColor(e.target.value)}
						/>
					</label>
				</div>

				{/* Emblem Preview */}
				<div className='emblem-preview-wrapper'>
					<EmblemPreview
						shape={shape}
						colorScheme={colorScheme}
						gradientStart={gradientStart}
						gradientEnd={gradientEnd}
						useGradient={useGradient}
						background={background}
						borderWidth={borderWidth}
						borderColor={borderColor}
						pattern={pattern}
						patternColor={patternColor}
						customPattern={customPattern}
						accentElements={accentElements}
						texts={texts}
					/>
				</div>

				{/* Right Column */}
				<div className='inputs-column'>
					{/* Pattern Selection */}
					<label>
						Pattern:
						<select value={pattern} onChange={e => setPattern(e.target.value)}>
							<option value='none'>None</option>
							<option value='stripes'>Stripes</option>
							<option value='chevrons'>Chevrons</option>
							<option value='polkaDots'>Polka Dots</option>
							<option value='custom'>Custom Pattern</option>
						</select>
					</label>

					{/* Pattern Color */}
					{pattern !== 'none' && pattern !== 'custom' && (
						<label>
							Pattern Color:
							<input
								type='color'
								value={patternColor}
								onChange={e => setPatternColor(e.target.value)}
							/>
						</label>
					)}

					{/* Custom Pattern Upload */}
					{pattern === 'custom' && (
						<label>
							Upload Pattern:
							<input
								type='file'
								onChange={handlePatternUpload}
								accept='image/*'
							/>
						</label>
					)}

					{/* Add Accent Element */}
					<label>
						Add Accent Element:
						<select
							onChange={e => {
								const newElement = {
									type: e.target.value,
									color: '#000000',
									scale: 1,
									rotation: 0,
								}
								setAccentElements([...accentElements, newElement])
							}}
						>
							{availableIcons.map(icon => (
								<option key={icon} value={icon}>
									{icon.charAt(0).toUpperCase() + icon.slice(1)}
								</option>
							))}
							<option value='custom'>Custom Accent</option>
						</select>
					</label>

					{/* Accent Element Customization */}
					{accentElements.map((element, index) => (
						<div key={index}>
							<h4>Accent Element {index + 1}</h4>
							{/* Color */}
							<label>
								Color:
								<input
									type='color'
									value={element.color}
									onChange={e => {
										const updatedElements = [...accentElements]
										updatedElements[index].color = e.target.value
										setAccentElements(updatedElements)
									}}
								/>
							</label>
							{/* Scale */}
							<label>
								Scale:
								<input
									type='number'
									value={element.scale}
									onChange={e => {
										const updatedElements = [...accentElements]
										updatedElements[index].scale = e.target.value
										setAccentElements(updatedElements)
									}}
									min='0.1'
									max='3'
									step='0.1'
								/>
							</label>
							{/* Rotation */}
							<label>
								Rotation:
								<input
									type='number'
									value={element.rotation}
									onChange={e => {
										const updatedElements = [...accentElements]
										updatedElements[index].rotation = e.target.value
										setAccentElements(updatedElements)
									}}
									min='0'
									max='360'
								/>
							</label>
							{/* Custom Accent Upload */}
							{element.type === 'custom' && (
								<label>
									Upload Accent:
									<input
										type='file'
										onChange={e => handleAccentUpload(e, index)}
										accept='image/*'
									/>
								</label>
							)}
						</div>
					))}

					{/* Add Text */}
					<button
						onClick={() =>
							setTexts([
								...texts,
								{
									content: '',
									fontFamily: 'Arial',
									fontSize: 10,
									fontColor: '#000000',
								},
							])
						}
					>
						Add Text
					</button>

					{/* Text Customization */}
					{texts.map((txt, index) => (
						<div key={index}>
							<h4>Text {index + 1}</h4>
							{/* Text Content */}
							<label>
								Content:
								<input
									type='text'
									value={txt.content}
									maxLength={20}
									onChange={e => {
										const updatedTexts = [...texts]
										updatedTexts[index].content = e.target.value
										setTexts(updatedTexts)
									}}
									placeholder='Enter text'
								/>
							</label>
							{/* Font Family */}
							<label>
								Font Family:
								<select
									value={txt.fontFamily}
									onChange={e => {
										const updatedTexts = [...texts]
										updatedTexts[index].fontFamily = e.target.value
										setTexts(updatedTexts)
									}}
								>
									<option value='Arial'>Arial</option>
									<option value='Times New Roman'>Times New Roman</option>
									<option value='Helvetica'>Helvetica</option>
									<option value='Courier New'>Courier New</option>
								</select>
							</label>
							{/* Font Size */}
							<label>
								Font Size:
								<input
									type='number'
									value={txt.fontSize}
									onChange={e => {
										const updatedTexts = [...texts]
										updatedTexts[index].fontSize = e.target.value
										setTexts(updatedTexts)
									}}
									min='5'
									max='30'
								/>
							</label>
							{/* Font Color */}
							<label>
								Font Color:
								<input
									type='color'
									value={txt.fontColor}
									onChange={e => {
										const updatedTexts = [...texts]
										updatedTexts[index].fontColor = e.target.value
										setTexts(updatedTexts)
									}}
								/>
							</label>
						</div>
					))}
				</div>
			</div>
			<GenerateEmblem />
			<CreateEmblem />
		</div>
	)
}

export default EmblemConstructor

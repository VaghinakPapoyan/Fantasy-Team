import React from 'react'
import Draggable from 'react-draggable'

const EmblemPreview = ({
	shape,
	colorScheme,
	gradientStart,
	gradientEnd,
	useGradient,
	background,
	borderWidth,
	borderColor,
	pattern,
	patternColor,
	customPattern,
	accentElements,
	texts,
}) => {
	const renderShape = () => {
		// Determine the fill based on whether a gradient is used or a solid color scheme
		const fill = useGradient ? 'url(#emblemGradient)' : colorScheme

		// Common properties applied to all shapes, such as fill, stroke, and drop shadow filter
		const commonProps = {
			fill,
			stroke: borderColor,
			strokeWidth: borderWidth,
			filter: 'url(#dropshadow)',
		}

		// Render the appropriate shape based on the 'shape' prop
		switch (shape) {
			case 'shield':
				// Improved shield shape with curved sides
				return (
					<path d='M50 5 L85 25 Q85 65 50 95 Q15 65 15 25 Z' {...commonProps} />
				)
			case 'circle':
				// A simple circle centered at (50, 50) with a radius of 45
				return <circle cx='50' cy='50' r='45' {...commonProps} />
			case 'square':
				// A square starting at (10, 10) with a width and height of 80
				return <rect x='10' y='10' width='80' height='80' {...commonProps} />
			case 'pentagon':
				// A pentagon with five points
				return (
					<polygon points='50,10 90,35 75,85 25,85 10,35' {...commonProps} />
				)
			case 'hexagon':
				// A hexagon with six points
				return (
					<polygon
						points='50,5 90,25 90,75 50,95 10,75 10,25'
						{...commonProps}
					/>
				)
			case 'diamond':
				// Adjusted diamond shape with better proportions
				return <polygon points='50,15 85,50 50,85 15,50' {...commonProps} />
			case 'triangle':
				// An equilateral triangle with the base at the bottom
				return <polygon points='50,10 90,85 10,85' {...commonProps} />
			case 'oval':
				// An oval centered at (50, 50) with different radii for x and y
				return <ellipse cx='50' cy='50' rx='45' ry='30' {...commonProps} />
			case 'star':
				// A star shape with ten points
				return (
					<polygon
						points='50,10 61,35 90,35 66,54 76,85 50,68 24,85 34,54 10,35 39,35'
						{...commonProps}
					/>
				)
			case 'cross':
				// A cross shape composed of a series of lines
				return (
					<path
						d='M40 10 H60 V40 H90 V60 H60 V90 H40 V60 H10 V40 H40 Z'
						{...commonProps}
					/>
				)
			case 'shield-rounded':
				// Shield with improved rounded edges
				return (
					<path
						d='M50 5 Q85 25 85 65 Q50 95 15 65 Q15 25 50 5 Z'
						{...commonProps}
					/>
				)
			case 'crest':
				// Improved crest shape with smoother curves
				return (
					<path
						d='M50 5 C70 15 85 35 85 65 C85 85 65 95 50 95 C35 95 15 85 15 65 C15 35 30 15 50 5 Z'
						{...commonProps}
					/>
				)
			case 'rounded-square':
				// A square with rounded corners, specified by 'rx' and 'ry'
				return (
					<rect
						x='10'
						y='10'
						width='80'
						height='80'
						rx='15'
						ry='15'
						{...commonProps}
					/>
				)
			case 'flame':
				// Better flame shape using cubic Bézier curves
				return (
					<path
						d='M50 95 C30 70 35 50 45 35 C50 25 45 15 50 5 C55 15 50 25 55 35 C65 50 70 70 50 95 Z'
						{...commonProps}
					/>
				)
			case 'badge':
				// Adjusted badge shape with better proportions
				return (
					<path
						d='M50 5 L75 20 L85 50 L75 80 L50 95 L25 80 L15 50 L25 20 Z'
						{...commonProps}
					/>
				)
			case 'circular-shield':
				// Corrected circular shield using circle element
				return <circle cx='50' cy='50' r='45' {...commonProps} />
			case 'leaf':
				// A leaf-like shape using quadratic Bézier curves
				return (
					<path
						d='M50 5 Q80 30 70 60 Q50 95 30 60 Q20 30 50 5 Z'
						{...commonProps}
					/>
				)
			case 'arrowhead':
				// An arrowhead shape with a pointed top and rectangular base
				return (
					<path
						d='M50 5 L90 80 L70 80 L70 95 L30 95 L30 80 L10 80 Z'
						{...commonProps}
					/>
				)
			default:
				// Return null if the shape is not recognized
				return null
		}
	}

	const renderPattern = () => {
		switch (pattern) {
			case 'stripes':
				return (
					<pattern
						id='stripes'
						patternUnits='userSpaceOnUse'
						width='10'
						height='10'
					>
						<rect width='5' height='10' fill={patternColor} />
						<rect x='5' width='5' height='10' fill='transparent' />
					</pattern>
				)
			case 'chevrons':
				return (
					<pattern
						id='chevrons'
						patternUnits='userSpaceOnUse'
						width='10'
						height='10'
					>
						<path d='M0,5 L5,0 L10,5 L5,10 Z' fill={patternColor} />
					</pattern>
				)
			case 'polkaDots':
				return (
					<pattern
						id='polkaDots'
						patternUnits='userSpaceOnUse'
						width='10'
						height='10'
					>
						<circle cx='5' cy='5' r='2' fill={patternColor} />
					</pattern>
				)
			case 'custom':
				return (
					<pattern
						id='customPattern'
						patternUnits='userSpaceOnUse'
						width='100'
						height='100'
					>
						<image href={customPattern} x='0' y='0' width='100' height='100' />
					</pattern>
				)
			default:
				return null
		}
	}

	const renderAccentElements = () => {
		return accentElements.map((element, index) => {
			const transform = `translate(${element.x || 0}, ${
				element.y || 0
			}) scale(${element.scale || 1}) rotate(${element.rotation || 0}, 50, 50)`

			if (element.type === 'custom') {
				return (
					<Draggable key={index}>
						<image
							href={element.customAccent}
							x='25'
							y='25'
							width={50 * (element.scale || 1)}
							height={50 * (element.scale || 1)}
							preserveAspectRatio='xMidYMid meet'
						/>
					</Draggable>
				)
			}
			// Define SVG paths or shapes for each icon
			const iconPaths = {
				star: 'M50,15 L61,35 L82,38 L67,54 L70,75 L50,65 L30,75 L33,54 L18,38 L39,35 Z',
				lion: 'M50 30 L60 50 L50 70 L40 50 Z',
				eagle: 'M50 20 L70 60 L50 80 L30 60 Z',
				crown: 'M30 60 L50 30 L70 60 L65 70 L50 55 L35 70 Z',
				sword: 'M50 5 L52 40 L48 40 L50 5 Z',
				flame: 'M50 15 C45 25, 55 35, 50 45 C60 35, 40 25, 50 15 Z',
				lightning: 'M45 5 L55 5 L50 40 L60 40 L40 95 L50 50 L40 50 Z',
				wolf: 'M50 10 L60 40 L50 70 L40 40 Z',
				tiger: 'M50 15 L65 45 L50 75 L35 45 Z',
				dragon: 'M50 10 C60 20, 70 40, 50 60 C30 40, 40 20, 50 10 Z',
				laurel: 'M40 10 C30 30, 30 70, 40 90 M60 10 C70 30, 70 70, 60 90',
			}
			return (
				<Draggable key={index}>
					<g>
						<path
							transform={`scale(${element.scale || 1}) rotate(${
								element.rotation || 0
							}, 50, 50)`}
							d={iconPaths[element.type]}
							fill={element.color}
						/>
					</g>
				</Draggable>
			)
		})
	}

	const renderTexts = () => {
		return texts.map((txt, index) => (
			<Draggable key={index}>
				<text
					x='50'
					y={90 - index * 10} // Adjust y-position for each text
					fontSize={txt.fontSize}
					textAnchor='middle'
					fill={txt.fontColor}
					fontFamily={txt.fontFamily}
				>
					{txt.content}
				</text>
			</Draggable>
		))
	}

	return (
		<div className='emblem-preview'>
			<svg
				width={300}
				height={300}
				viewBox='0 0 100 100'
				xmlns='http://www.w3.org/2000/svg'
			>
				{/* Definitions */}
				<defs>
					{/* Gradient Definition */}
					{useGradient && (
						<linearGradient id='emblemGradient' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='0%' stopColor={gradientStart} />
							<stop offset='100%' stopColor={gradientEnd} />
						</linearGradient>
					)}
					{/* Patterns */}
					{renderPattern()}
					{/* Drop Shadow Filter */}
					<filter id='dropshadow' height='130%'>
						<feGaussianBlur in='SourceAlpha' stdDeviation='3' />
						<feOffset dx='2' dy='2' result='offsetblur' />
						<feComponentTransfer>
							<feFuncA type='linear' slope='0.5' />
						</feComponentTransfer>
						<feMerge>
							<feMergeNode />
							<feMergeNode in='SourceGraphic' />
						</feMerge>
					</filter>
				</defs>

				{/* Background */}
				<rect width='100' height='100' fill={background} />

				{/* Pattern Overlay */}
				{pattern !== 'none' && (
					<rect
						width='100'
						height='100'
						fill={`url(#${pattern === 'custom' ? 'customPattern' : pattern})`}
					/>
				)}

				{/* Shape */}
				{renderShape()}

				{/* Accent Elements */}
				{renderAccentElements()}

				{/* Texts */}
				{renderTexts()}
			</svg>
		</div>
	)
}

export default EmblemPreview

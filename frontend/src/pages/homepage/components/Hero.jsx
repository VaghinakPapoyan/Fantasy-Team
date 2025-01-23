import React from 'react'
import HeroImage from '../../../assets/images/cover-page-image.png'
import BallImage from '../../../assets/images/ball.svg'
import BallImageBlue from '../../../assets/images/ball-blue.svg'
import coverPageBackgroundImage from '../../../assets/images/cover-page-background.svg'

export default function Hero() {
	return (
		<section className='hero'>
			<div className='cover-page-background'>
				<img src={coverPageBackgroundImage} alt='Cover Page Background' />
			</div>
			<div className='container'>
				<div className='left'>
					<h1>
						create your <span>dream team</span>
					</h1>
					<div className='line'></div>
					<p>
						Fantasy Team offers Armenia’s first-ever fantasy football platform,
						combining maximum gamification with a dynamic community experience.
					</p>
					<button className='btn'>
						<p>Join now</p>
						<div className='ball'>
							<img src={BallImage} alt='ball' />
							<img src={BallImageBlue} alt='ball' />
						</div>
					</button>
				</div>
				<div className='right'>
					<div className='light'></div>
					<img src={HeroImage} alt='hero page' />
				</div>
			</div>
		</section>
	)
}

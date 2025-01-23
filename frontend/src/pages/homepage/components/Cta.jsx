import React from 'react'
import BallImage from '../../../assets/images/cta-ball.png'
import ArrowRightImage from '../../../assets/images/arrow-right.svg'

export default function Cta() {
	return (
		<section className='cta'>
			<div className='container'>
				<div className='left'>
					<h2>Sign Up Today and Get 100 Bonus Points!</h2>
					<p>
						Join our fantasy football community and kick off your journey with
						an instant boost! When you sign up today, you'll receive 100 bonus
						points to get ahead in building your dream team.
					</p>
					<button className='btn'>
						<p>Sign Up</p>
						<img src={ArrowRightImage} alt='arrow' />
					</button>
				</div>
				<img className='goal' src={BallImage} alt='goal' />
			</div>
		</section>
	)
}

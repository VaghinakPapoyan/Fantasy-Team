import React from 'react'
import useInView from '../../../utils/useInView.js'

import FeaturesImage1 from '../../../assets/images/features-1.png'
import FeaturesImage2 from '../../../assets/images/features-2.png'
import FeaturesImage3 from '../../../assets/images/features-3.png'
import FeaturesImage4 from '../../../assets/images/features-4.png'
import Line1 from '../../../assets/images/line-1.png'
import Line2 from '../../../assets/images/line-2.png'
import Line3 from '../../../assets/images/line-3.png'
import Line4 from '../../../assets/images/line-4.png'

export default function Features() {
	const [line1Ref, is1Visible] = useInView(0, { threshold: 0.1 })
	const [line2Ref, is2Visible] = useInView(0, { threshold: 0.15 })
	const [line3Ref, is3Visible] = useInView(0, { threshold: 0.2 })
	const [line4Ref, is4Visible] = useInView(0, { threshold: 0.25 })
	return (
		<section className='features'>
			<div className='placeholder' ref={line1Ref}></div>
			<div className='placeholder' ref={line2Ref}></div>
			<div className='placeholder' ref={line3Ref}></div>
			<div className='placeholder' ref={line4Ref}></div>
			<div className={is1Visible ? 'line-visible line1' : 'line1'}>
				<img src={Line1} alt='line' />
			</div>
			<div className={is2Visible ? 'line-visible line2' : 'line2'}>
				<img src={Line2} alt='line' />
			</div>
			<div className={is3Visible ? 'line-visible line3' : 'line3'}>
				<img src={Line3} alt='line' />
			</div>
			<div className={is4Visible ? 'line-visible line4' : 'line4'}>
				<img src={Line4} alt='line' />
			</div>
			<div className='container'>
				<h2 className='title'>Features</h2>
				<div className='features-list'>
					<div className='feature'>
						<div className='feature-body'>
							<img src={FeaturesImage1} alt='feature' />
							<div className='right'>
								<h3>Customize you team</h3>
								<p>
									Build your dream squad with personalized formations,
									transfers, and custom kits. Take control and lead your team to
									victory!
								</p>
							</div>
						</div>
					</div>
					<div className='feature'>
						<div className='feature-body'>
							<img src={FeaturesImage2} alt='feature' />
							<div className='right'>
								<h3>Earn badges, points, XP</h3>
								<p>
									Rise through the ranks by earning XP and unlocking badges.
									Prove your skills and showcase your achievements!
								</p>
							</div>
						</div>
					</div>
					<div className='feature'>
						<div className='feature-body'>
							<img src={FeaturesImage3} alt='feature' />
							<div className='right'>
								<h3>Win Prizes</h3>
								<p>
									Compete for cash, rewards, and bonuses. Your strategy and
									football knowledge can lead you to big victories!
								</p>
							</div>
						</div>
					</div>
					<div className='feature'>
						<div className='feature-body'>
							<img src={FeaturesImage4} alt='feature' />
							<div className='right'>
								<h3>H2H competitions</h3>
								<p>
									Challenge rivals in intense H2H battles. Track your wins and
									outplay your competitors to be the ultimate champion!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

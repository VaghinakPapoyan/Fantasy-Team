import React from 'react'
import RewardImage1 from '../../../assets/images/reward-1.png'
import RewardImage2 from '../../../assets/images/reward-2.png'
import RewardImage3 from '../../../assets/images/reward-3.png'
import RewardImage4 from '../../../assets/images/reward-4.png'
import useInView from '../../../utils/useInView.js'

export default function Rewards() {
	const [prize1Ref, is1Visible] = useInView(0, { threshold: 0.6 })
	const [prize2Ref, is2Visible] = useInView(0, { threshold: 0.6 })
	const [prize3Ref, is3Visible] = useInView(0, { threshold: 0.6 })
	const [prize4Ref, is4Visible] = useInView(0, { threshold: 0.6 })

	return (
		<section className='rewards'>
			<div className='background'></div>
			<div className='container'>
				<h2>Win incredible rewards!</h2>
				<div className='rewards-list'>
					<div
						ref={prize1Ref}
						className={is1Visible ? 'reward-visible reward t' : 'reward t'}
					>
						<div className='reward-image'>
							<img src={RewardImage1} alt='' />
						</div>
						<h4>PlayStation 5</h4>
					</div>
					<div
						ref={prize2Ref}
						className={is2Visible ? 'reward-visible b reward' : 'reward b'}
					>
						<h4>Team jerseys</h4>
						<div className='reward-image'>
							<img src={RewardImage2} alt='' />
						</div>
					</div>
					<div
						ref={prize3Ref}
						className={is3Visible ? 'reward-visible t reward' : 'reward t'}
					>
						<div className='reward-image'>
							<img src={RewardImage3} alt='' />
						</div>
						<h4>Tickets</h4>
					</div>
					<div
						ref={prize4Ref}
						className={is4Visible ? 'reward-visible b reward' : 'reward b'}
					>
						<h4>Surprise</h4>
						<div className='reward-image'>
							<img src={RewardImage4} alt='' />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

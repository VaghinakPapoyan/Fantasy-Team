import React from 'react'
import Step1Image from '../../../assets/images/step-1.svg'
import Step2Image from '../../../assets/images/step-2.svg'
import Step3Image from '../../../assets/images/step-3.svg'
import StepsBackgroundLeft from '../../../assets/images/steps-bg-left.png'
import StepsBackgroundRight from '../../../assets/images/steps-bg-right.svg'
import FirstStepArrowImage from '../../../assets/images/arrow-step-1.svg'
import SecondStepArrowImage from '../../../assets/images/arrow-step-2.svg'
import useInView from '../../../utils/useInView.js'

export default function Steps() {
	const [block1Ref, is1Visible] = useInView(0, { threshold: 0.55 })
	const [block2Ref, is2Visible] = useInView(0, { threshold: 0.7 })
	const [block3Ref, is3Visible] = useInView(0, { threshold: 0.85 })
	return (
		<section className='how-to-start main-content'>
			<img
				className='steps-background-left'
				src={StepsBackgroundLeft}
				alt='neon lines'
			/>
			<img
				className='steps-background-right'
				src={StepsBackgroundRight}
				alt='neon lines'
			/>
			<div className='container'>
				<h2 className='title'>How to Start</h2>
				<div className='steps'>
					<div
						className={is1Visible ? 'step visible' : 'non-visible step'}
						ref={block1Ref}
					>
						<div className='head'>
							<img className='arrow' src={FirstStepArrowImage} alt='Arrow' />
							<div className='text'>step 1</div>
						</div>
						<img src={Step1Image} alt='user' />
						<h3>Registration</h3>
						<p>Sign in to the website</p>
					</div>
					<div
						className={is2Visible ? 'step visible' : 'non-visible step'}
						ref={block2Ref}
					>
						<div className='head'>
							<img className='arrow' src={SecondStepArrowImage} alt='Arrow' />
							<div className='text'>step 2</div>
						</div>
						<img src={Step2Image} alt='user' />
						<h3>Join the League</h3>
						<p>Join the league you want </p>
					</div>
					<div
						className={is3Visible ? 'step visible' : 'non-visible step'}
						ref={block3Ref}
					>
						<div className='head'>
							<div className='text'>step 3</div>
						</div>
						<img src={Step3Image} alt='user' />
						<h3>Create Your team</h3>
						<p>Build your first fantasy team</p>
					</div>
				</div>
			</div>
		</section>
	)
}

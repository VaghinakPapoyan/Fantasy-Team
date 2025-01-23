import React from 'react'
import SlideImage1 from '../../../assets/images/slide-1.png'
import SlideImage2 from '../../../assets/images/slide-2.png'
import CheckImage from '../../../assets/images/check.svg'

export default function JoinTheLeagues() {
	return (
		<section className='join-the-league'>
			<div className='container'>
				<h2 className='title'>Join the leagues</h2>
				<div className='slides'>
					<div className='slide'>
						<div className='slide-body'>
							<i className='label'>Most profitable</i>
							<img src={SlideImage2} alt='slide' />
							<h4>UEFA</h4>
							<p>By joining this league you will receive the following:</p>
							<ul>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Account access</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Access to fantasy game</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
							</ul>
							<button className='btn'>Join now</button>
						</div>
					</div>
					<div className='slide'>
						<div className='slide-body'>
							<i className='label'>Most profitable</i>
							<img src={SlideImage1} alt='slide' />
							<h4>Premiere League</h4>
							<p>By joining this league you will receive the following:</p>
							<ul>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Account access</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Access to fantasy game</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
							</ul>
							<button className='btn'>Join now</button>
						</div>
					</div>
					<div className='slide'>
						<div className='slide-body'>
							<i className='label'>Most profitable</i>
							<img src={SlideImage2} alt='slide' />
							<h4>UEFA</h4>
							<p>By joining this league you will receive the following:</p>
							<ul>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Account access</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Access to fantasy game</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
							</ul>
							<button className='btn'>Join now</button>
						</div>
					</div>
					<div className='slide'>
						<div className='slide-body'>
							<i className='label'>Most profitable</i>
							<img src={SlideImage1} alt='slide' />
							<h4>Premiere League</h4>
							<p>By joining this league you will receive the following:</p>
							<ul>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Account access</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Access to fantasy game</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
							</ul>
							<button className='btn'>Join now</button>
						</div>
					</div>
					<div className='slide'>
						<div className='slide-body'>
							<i className='label'>Most profitable</i>
							<img src={SlideImage2} alt='slide' />
							<h4>UEFA</h4>
							<p>By joining this league you will receive the following:</p>
							<ul>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Account access</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>Access to fantasy game</p>
								</li>
								<li>
									<div className='check'>
										<img src={CheckImage} alt='' />{' '}
									</div>
									<p>30h Fast generations</p>
								</li>
							</ul>
							<button className='btn'>Join now</button>
						</div>
					</div>
				</div>
				<div className='slider-control'>
					<div className='slider-control__container'>
						<div className='control__button'></div>
					</div>
				</div>
			</div>
		</section>
	)
}

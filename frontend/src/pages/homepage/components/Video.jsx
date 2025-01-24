import React from 'react'
import PlayVideoImage from '../../../assets/images/video-preview.png'
import VideoPlayImage from '../../../assets/images/video-play.png'
import ArrowLarge from '../../../assets/images/arrow-large.svg'

export default function Video() {
	return (
		<section className='video'>
			<div className='container'>
				<div className='left'>
					<div className='video'>
						<img src={PlayVideoImage} alt='' />
						<button>
							<img src={VideoPlayImage} alt='' />
						</button>
					</div>
				</div>
				<div className='right'>
					<h2>what is fantasy team?</h2>
					<h4>Watch the video or scroll down</h4>
					<a href='#main-part'>
						<img src={ArrowLarge} alt='arrow' />
					</a>
				</div>
			</div>
		</section>
	)
}

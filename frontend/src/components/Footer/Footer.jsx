import React from 'react'
import logoImage from '../../assets/images/logo-image.png'
import YoutubeImage from '../../assets/images/youtube.svg'
import InstagramImage from '../../assets/images/instagram.svg'
import XImage from '../../assets/images/twitter.svg'
import FacebookImage from '../../assets/images/facebook.svg'
import { Link } from 'react-router-dom'
import './styles.scss'

export default function Footer() {
	return (
		<footer>
			<div className='container'>
				<div className='top'>
					<div className='left'>
						<div className='logo'>
							<img src={logoImage} alt='' />
						</div>
					</div>
					<div className='center'>
						<nav>
							<ul>
								<li>
									<Link to='/all-leagues'>All leagues</Link>
								</li>
								<li>
									<Link to='/hot-to-play'>How to play</Link>
								</li>
								<li>
									<Link to='/faq'>Help Center</Link>
								</li>
							</ul>
						</nav>
					</div>
					<div className='right'>
						<ul className='soc'>
							<li>
								<img src={XImage} alt='X' />
							</li>
							<li>
								<img src={InstagramImage} alt='Instagram' />
							</li>
							<li>
								<img src={YoutubeImage} alt='Youtube' />
							</li>
							<li>
								<img src={FacebookImage} alt='Facebook' />
							</li>
						</ul>
					</div>
				</div>
				<div className='bottom'>© Fantasy Team 2024</div>
			</div>
		</footer>
	)
}

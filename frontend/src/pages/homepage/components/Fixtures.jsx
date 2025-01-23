import React from 'react'
import ArsenalImage from '../../../assets/images/arsenal.png'
import ChelseaImage from '../../../assets/images/chelsea.png'
import ManchesterImage from '../../../assets/images/manchester.png'
import LiverpoolImage from '../../../assets/images/liverpool.png'
import PolygonImage from '../../../assets/images/polygon.png'
import VSImage from '../../../assets/images/VS.svg'

export default function Fixtures() {
	return (
		<section className='fixtures'>
			<div className='container'>
				<h2 className='title'>The most popular fixtures</h2>
				<div className='fixtures-list'>
					<div className='fixture'>
						<div className='fixture-body'>
							<div className='fixture-top'>
								<div className='left'>
									<h4>LIV</h4>
									<img src={LiverpoolImage} alt='Liverpool' />
								</div>
								<div className='center'>
									<img className='polygon' src={PolygonImage} alt='polygon' />
									<img className='vs' src={VSImage} alt='versus' />
								</div>
								<div className='right'>
									<img src={ArsenalImage} alt='Arsenal' />
									<h4>ARS</h4>
								</div>
							</div>
							<div className='fixture-bottom'>
								<h5>English premier league</h5>
								<p>december 24, 2024</p>
								<p>4:30 PM</p>
							</div>
						</div>
					</div>
					<div className='fixture'>
						<div className='fixture-body'>
							<div className='fixture-top'>
								<div className='left'>
									<h4>MUN</h4>
									<img src={ManchesterImage} alt='Manchester' />
								</div>
								<div className='center'>
									<img className='polygon' src={PolygonImage} alt='polygon' />
									<img className='vs' src={VSImage} alt='versus' />
								</div>
								<div className='right'>
									<img src={ChelseaImage} alt='Chelsea' />
									<h4>CHE</h4>
								</div>
							</div>
							<div className='fixture-bottom'>
								<h5>UEFA champions league</h5>
								<p>March 24, 2024</p>
								<p>4:30 PM</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

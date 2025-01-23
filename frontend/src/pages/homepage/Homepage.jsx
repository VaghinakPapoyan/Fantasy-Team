import React from 'react'
import Hero from './components/Hero.jsx'
import Video from './components/Video.jsx'
import Steps from './components/Steps.jsx'
import Rewards from './components/Rewards.jsx'
import Features from './components/Features.jsx'
import Fixtures from './components/Fixtures.jsx'
import JoinTheLeague from './components/JoinTheLeagues.jsx'
import Cta from './components/Cta.jsx'
import Registration from '../../components/Registration/Registration.jsx'
import Login from '../../components/Login/Login.jsx'

import './styles.scss'
export default function Homepage({
	registrationModalOpened,
	loginModalOpened,
	closeRegistrationModal,
	closeLoginModal,
	openRegistrationModal,
	openLoginModal,
	closeAllModals,
}) {
	return (
		<main>
			<Hero />
			<Video />
			<Steps />
			<Rewards />
			<Features />
			<Fixtures />
			<JoinTheLeague />
			<Cta />
			{registrationModalOpened ? (
				<Registration
					closeAllModals={closeAllModals}
					openLoginModal={openLoginModal}
					closeRegistrationModal={closeRegistrationModal}
				/>
			) : null}
			{loginModalOpened ? (
				<Login
					closeLoginModal={closeLoginModal}
					openRegistrationModal={openRegistrationModal}
					closeAllModals={closeAllModals}
				/>
			) : null}
		</main>
	)
}

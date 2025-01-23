import React, { useState } from 'react'
import RegistrationForm from './RegistrationForm.jsx'
import Verification from '../Verification/Verification.jsx'
import './styles.scss'

export default function Registration({
	closeRegistrationModal,
	openLoginModal,
	closeAllModals,
}) {
	const [email, setEmail] = useState('')
	const [showVerification, setShowVerification] = useState(false)
	const [verificationCode, setVerificationCode] = useState('')

	// Called by RegistrationForm on successful registration
	const handleRegistrationSuccess = code => {
		setVerificationCode(code)
		setShowVerification(true)
	}

	// If user wants to go back from verification
	const handleBack = () => {
		setShowVerification(false)
		setVerificationCode('')
	}

	return (
		<div className='registration'>
			<div
				className='background'
				onClick={() => closeRegistrationModal()}
			></div>
			{!showVerification ? (
				<RegistrationForm
					email={email}
					setEmail={setEmail}
					onSuccess={handleRegistrationSuccess}
					closeRegistrationModal={closeRegistrationModal}
					openLoginModal={openLoginModal}
				/>
			) : (
				<Verification
					defaultEmail={email}
					closeAllModals={closeAllModals}
					defaultCode={verificationCode}
					onBack={handleBack}
				/>
			)}
		</div>
	)
}

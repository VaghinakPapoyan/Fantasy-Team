import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Asynchronous function to send an email
export default async function sendEmail(to, subject, text) {
	// Create a transporter object using SMTP transport
	let transporter = nodemailer.createTransport({
		service: 'gmail', // Use Gmail as the SMTP server
		auth: {
			user: process.env.SMTP_USERNAME, // Your email address
			pass: process.env.SMTP_PASSWORD, // Your email password
		},
	})

	// Send email using the transporter
	let info = await transporter.sendMail({
		from: '"Fantasy Team" <vaghinak.papoyan@gmail.com>', // Sender address
		to: to, // Recipient address
		subject: subject, // Subject line
		text: text, // Email body as plain text
	})

	// Log the message ID for debugging
	console.log('Message sent: %s', info.messageId)
}

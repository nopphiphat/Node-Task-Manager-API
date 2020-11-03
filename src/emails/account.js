const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: process.env.SENDGRID_EMAIL,
		subject: 'Thanks for using the app!',
		text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
	})
}

const sendCancellationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: process.env.SENDGRID_EMAIL,
		subject: 'Sorry to see you go!',
		text: `Goodbye, ${name}. I hope to see you back sometime soon.`
	})
}

module.exports = {
	sendWelcomeEmail, 
	sendCancellationEmail
}
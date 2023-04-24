const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

// Creating email transport
const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	}
});


const sendMagicLink = asyncHandler(async (email, link, type) => {
    const yourLink = `http://localhost:5173/sign-in?link=${link}`;
    if (type === 'sign-up') {
        let subject = "<h2>Your Sign-Up | Login Link</h2>"
        let body = `<h3>Hello and welcome to e-shop Online Marketplace</h3> 
                    <p> This is your link to confirm your account: <a href="${yourLink}">Login</a>.</p>
                     <p>Needless to remind you not to share this link with anyone 🤫</p>
                    `
    }
    else {
        let subject = "<h2>Your Sign-In Link</h2>"
        let body = `<h3>Welcome back to e-shop Online Marketplace</h3> 
                    <p>This is your link to sign-in to your account: <a href="${yourLink}">Login</a>.</p>
                     <p>Needless to remind you not to share this link with anyone 🤫</p>
                     `
        const mailOptions = {
			to: email,
			from: process.env.NODEMAILER_EMAIL,
			subject: subject,
			html: body
        }
        
        try{
			const response = await transport.sendMail(mailOptions)
            console.log('Link sent 📬')
            // Sending the following if status code == 200
            res.status(200).json({ response, message: 'Email Sent!' })
			// return({ok:true,message:'email sent'})
		}
		catch( error ){
			console.log("Failed 😭", err)
			res.status(500).json(error)
		}
    }
})


module.exports = { sendMagicLink }
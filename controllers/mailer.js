const nodemailer = require("nodemailer");
const Mailgen = require('mailgen');


// Creating email transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: process.env.MAIL_SERVICE,
    port: Number(process.env.MAIL_PORT),
    secure: Boolean(process.env.MAIL_SECURE),
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    }
});


const sendMagicLink = async (user, subject, magic_link) => {
    try {
        const mailGenerator = new Mailgen({
            theme: "default",
            product : {
                name: "e-shop. Online Marketplace",
                link : 'https://mailgen.js/'
            }
        })

        // The email
        let email = {
            body: {
                name: user?.fullName,
                intro: 'Welcome to e-shop Online Marketplace! We\'re very excited to have you on board.',
                action: {
                    instructions: 'Click the link to confirm your account:',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Confirm your account',
                        link: magic_link
                    }
                },
                outro: 'Needless to remind you not to share this link with anyone 🤫.',
                signature: false,
            }
        };

    
        const mailOptions = {
            from: process.env.MAIL_EMAIL,
            to: user?.email,
			subject,
			html: mailGenerator.generate(email),
        }

        await transporter.sendMail(mailOptions)
        console.log('Link sent 📬')
        return { ok: true, message: 'Magic-Link sent successfully' };
    }
    catch (error) {
        console.log('Failed 😭', error);
        return { ok: false, message: 'Error sending email' };
    }
}


module.exports = { sendMagicLink }
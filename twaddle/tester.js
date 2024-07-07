
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Configure Mailgun transport
const auth = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
};
const nodemailerMailgun = nodemailer.createTransport(mg(auth));

// Route to send email
app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'Excited User <postmaster@sandbox9ab143eaa826435fb1bbc07e73fb9d7e.mailgun.org>',
        to: 'reshma.ragh@gmail.com',
        subject: 'Test Email',
        text: 'Hello from Mailgun!'
    };

    try {
        const info = await nodemailerMailgun.sendMail(mailOptions);
        console.log('Email sent:', info);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

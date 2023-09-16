const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());


// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define a route for sending emails
app.post('/send-email', (req, res) => {
    const { email, subject, message } = req.body;

    // Create a transporter for Gmail (or your email service provider)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'somebodythatiusedtoknow269@gmail.com',
            pass: 'simplepassword123!',
        },
    });

    // Email data
    const mailOptions = {
        from: 'somebodythatiusedtoknow269@gmail.com',
        to: 'somebodythatiusedtoknow269@gmail.com',
        subject: "Here's a subject",
        text: "Here is some text to go with the subject!",
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


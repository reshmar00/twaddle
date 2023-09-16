const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware with dynamic origin
app.use((req, res, next) => {
    cors({
        origin: (origin, callback) => {
            // Check if the origin matches the request's origin or allow all origins with '*'
            if (!origin || origin === req.headers.origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'POST', // You can customize the HTTP methods you want to allow
    })(req, res, next);
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Initialize Mailgun
const formData = require('form-data');
const Mailgun = require('mailgun-js');
const mailgun = new Mailgun({
    apiKey: 'b4249a24d01dd02a88b4040d0ea2a707-413e373c-810df927',
    domain: 'sandbox62100d4345c548aaa13eff2b42166cc1.mailgun.org',
});

// Define a route for sending emails
app.post('/send-email', (req, res) => {
    console.log('Received POST request at /send-email'); // Add this line to check if the request is reaching the server

    const { subject, message } = req.body; // Include password if needed for authentication

    const data = {
        from: "Excited User <mailgun@sandbox62100d4345c548aaa13eff2b42166cc1.mailgun.org>",
        to: ["shielabrof2004@yahoo.com"], // Update the recipient email address
        subject: subject,
        text: message,
        html: `<h1>${message}</h1>`, // Use the message as HTML content
    };

    console.log('Sending email...'); // Add this line to check if the email sending process is starting

    mailgun.messages().send(data, (error, body) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent:', body); // Add this line to check if the email was successfully sent
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

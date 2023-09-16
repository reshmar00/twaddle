const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

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
    const { subject, message } = req.body; // Include password if needed for authentication

    const data = {
        from: "Excited User <mailgun@sandbox62100d4345c548aaa13eff2b42166cc1.mailgun.org>",
        to: ["shielabrof2004@yahoo.com"], // Update the recipient email address
        subject: subject,
        text: message,
        html: `<h1>${message}</h1>`, // Use the message as HTML content
    };

    mailgun.messages().send(data, (error, body) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent:', body);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

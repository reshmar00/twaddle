
/* Imports */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();


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
        methods: 'POST',
    })(req, res, next);
});

/********* Code to handle email sending *********/

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Initialize Mailgun
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
        to: ["shielabrof2004@yahoo.com"],
        subject: subject,
        text: message,
        html: `<h1>${message}</h1>`, // Use the message as HTML content
    };

    console.log('Sending email...');

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


/*********** Code to handle file uploads ***********/

// Middleware to handle file uploads using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original file name
    }
});

const upload = multer({ storage: storage });

// Define a route for handling file uploads
app.post('/upload', upload.single('uploadTextFile'), (req, res) => {
    console.log('Received POST request at /upload');

    // Check if a file was uploaded successfully
    if (req.file) {
        console.log('File uploaded:', req.file);
        res.status(200).json({ message: 'File uploaded successfully' });
    } else {
        console.error('No file uploaded');
        res.status(400).json({ error: 'No file uploaded' });
    }
});

/***** Code fot using Events to play audio (emitting it) ******/

// Define a route for handling the play-pause event
app.post('/play-pause', (req, res) => {
    console.log('Received POST request at /play-pause');

    // Emit the play-pause event
    eventEmitter.emit('play-pause');

    res.status(200).json({ message: 'Play-pause event emitted' });
});

// Listen for the play-pause event and handle it
eventEmitter.on('play-pause', () => {
    // Handle the play-pause event here
    console.log('Play-pause event received on the server');
});

/****************** SERVER START ******************/

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

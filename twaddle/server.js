
/* Imports */
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const EventEmitter = require('events');

const app = express();
const port = process.env.PORT || 3000;
const eventEmitter = new EventEmitter();

// Use CORS middleware with dynamic origin
app.use((req, res, next) => {
    cors({
        origin: (origin, callback) => {
            if (!origin || origin === req.headers.origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'POST',
    })(req, res, next);
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

/*********** Code to handle email sending ***********/

// Define a route for sending emails
app.post('/send-email', (req, res) => {
    console.log('Received POST request at /send-email');

    const { to, subject, message } = req.body;

    const data = {
        from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
        to: to,
        subject: subject,
        text: message,
        html: `<h1>${message}</h1>`,
    };

    console.log('Sending email...', data);

    axios.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, data, {
        auth: {
            username: 'api',
            password: process.env.MAILGUN_API_KEY
        }
    })
        .then(response => {
            console.log('Email sent:', response.data);
            res.status(200).json({ message: 'Email sent successfully' });
        })
        .catch(error => {
            console.error('Error sending email:', error.response.data);
            res.status(500).json({ error: 'Error sending email' });
        });
});

/*********** Code to handle file uploads ***********/

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('uploadTextFile'), (req, res) => {
    console.log('Received POST request at /upload');

    if (req.file) {
        console.log('File uploaded:', req.file);
        res.status(200).json({ message: 'File uploaded successfully' });
    } else {
        console.error('No file uploaded');
        res.status(400).json({ error: 'No file uploaded' });
    }
});

/***** Code for using Events to play audio (emitting it) ******/

app.post('/play-pause', (req, res) => {
    console.log('Received POST request at /play-pause');

    eventEmitter.emit('play-pause');

    res.status(200).json({ message: 'Play-pause event emitted' });
});

eventEmitter.on('play-pause', () => {
    console.log('Play-pause event received on the server');
});

/****************** SERVER START ******************/

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

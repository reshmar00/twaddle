/* Suppressing warnings */
process.env.NODE_NO_WARNINGS = '1';

/* Imports */
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const multer = require('multer');

const cors = require('cors');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

/*********** Code to handle email sending ***********/

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
    const { to, subject, message } = req.body;

    const mailOptions = {
        from: 'Excited User <postmaster@sandbox9ab143eaa826435fb1bbc07e73fb9d7e.mailgun.org>',
        to: to,
        subject: subject,
        text: message
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

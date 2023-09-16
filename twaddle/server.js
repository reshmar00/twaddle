
/* Imports */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');

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

/********* Code to handle email sending *********/

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


/*********** Code to handle file uploads ***********/


// Middleware for handling file uploads
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Define a route for uploading text files
app.post('/upload', (req, res) => {
    console.log('Received a POST request at /upload');
    if (!req.files || !req.files.textFile) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const textFile = req.files.textFile;

    console.log('No file uploaded error dodged');

    // Ensure it's a text file
    if (textFile.mimetype !== 'text/plain') {
        return res.status(400).json({ error: 'Only text files (.txt) are allowed' });
    }

    console.log('Ensured it is a text file');

    // Save the uploaded file using a Promise
    const moveFile = () => {
        return new Promise((resolve, reject) => {
            const filePath = __dirname + '/uploads/' + textFile.name;
            textFile.mv(filePath, (err) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    reject(err);
                } else {
                    console.log('File moved successfully');
                    resolve();
                }
            });
        });
    };

    moveFile()
        .then(() => {
            console.log('If I am here, the file is successfully uploaded');
            res.status(200).json({ message: 'File uploaded successfully' });
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
            res.status(500).json({ error: 'Error uploading file' });
        });
});

// Define a route for downloading the uploaded text file
app.get('/download', (req, res) => {
    const filePath = __dirname + '/uploads/your_uploaded_file.txt'; // Replace with your actual file path
    const fileName = 'your_uploaded_file.txt'; // Replace with your actual file name

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading file' });
        }

        // Set the response headers for file download
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-type', 'text/plain');
        res.send(data);
    });
});


/****************** SERVER START ******************/

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const axios = require('axios');
document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the form
    const form = document.getElementById('emailForm');

    // Add a submit event listener to the form
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form data
        const email = form.querySelector('#email').value;
        const subject = form.querySelector('#subject').value;
        const message = form.querySelector('#message').value;

        // Data to send to the server
        const emailData = {
            email: email,
            subject: subject,
            message: message,
        };

        // Send a POST request to the server using Axios
        axios.post('http://localhost:3000/send-email', emailData)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    });
});
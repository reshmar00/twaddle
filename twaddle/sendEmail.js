document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the form
    const form = document.getElementById('emailForm');

    // Add a submit event listener to the form
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get form data
        const subject = form.querySelector('#subject').value;
        const message = form.querySelector('#message').value;

        // Data to send to the server as a JSON object
        const emailData = {
            subject: subject,
            message: message,
        };

        // Send a POST request to the server using fetch
        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Check if the email was sent successfully
                if (data.message === 'Email sent successfully') {
                    // Show a success message and clear the form
                    alert('Email Sent!');
                    form.reset(); // Clear the form
                } else {
                    // Show an error message
                    alert('There was an error sending the email');
                }
            })
            .catch(error => {
                console.error(error);
                // Show an error message
                alert('Error!');
            });
    });
});
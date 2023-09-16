document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the form
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('textFile');

    // Add a submit event listener to the form
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the selected file
        const textFile = fileInput.files[0];

        if (!textFile) {
            alert('Please select a file to upload.'); // No file selected, show an alert
            return;
        }

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('textFile', textFile);

        // Send a POST request to the server using fetch
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Check if the response indicates success
                if (data.message === 'File uploaded successfully') {
                    alert('File Uploaded!'); // Show success message
                    form.reset(); // Reset the form, clearing the file input
                } else {
                    alert('There was an error uploading the file'); // Show error message
                }
            })
            .catch(error => {
                console.error(error);
                alert('There was an error uploading the file'); // Show error message
            });
    });
});

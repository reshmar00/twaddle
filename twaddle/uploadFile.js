document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the form
    const uploadForm = document.getElementById('uploadForm');
    // Add a submit event listener to the form
    uploadForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the file input and file
        const fileInput = uploadForm.querySelector('#uploadTextFile');
        const file = fileInput.files[0];

        // Data to send to the server as FormData
        const formData = new FormData();
        formData.append('uploadTextFile', file);

        console.log("appending data")
        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Show a success message and clear the form
                alert('File Uploaded!');
                uploadForm.reset(); // Clear the form
            } else {
                // Show an error message
                alert('Error uploading file');
            }
        } catch (error) {
            console.error(error);
            // Show an error message
            alert('Error!');
        }
    });
});

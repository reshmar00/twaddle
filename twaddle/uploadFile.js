document.addEventListener('DOMContentLoaded', function () {
    // Get a reference to the form
    const uploadForm = document.getElementById('uploadForm');

    console.log("got a reference to the form")
    // Add a submit event listener to the form
    uploadForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        console.log("prevented default")
        // Get the file input and file
        const fileInput = uploadForm.querySelector('#uploadTextFile');
        console.log("got fileInput")
        const file = fileInput.files[0];
        console.log("got file[0]")
        // Data to send to the server as FormData

        const formData = new FormData();
        console.log("sending data")
        formData.append('uploadTextFile', file);

        console.log("appending data")
        try {
            console.log("entering try block")
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Show a success message and clear the form
                alert('File Uploaded!');
                console.log("file uploaded")
                uploadForm.reset(); // Clear the form
            } else {
                // Show an error message
                alert('Error uploading file');
                console.log("error")
                console.error(error);
            }
        } catch (error) {
            console.error(error);
            // Show an error message
            alert('Error uploading file');
        }
    });
});

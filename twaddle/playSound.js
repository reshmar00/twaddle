document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.querySelector('.play-button');

    // Function to handle play/pause behavior
    const handlePlayPause = function () {
        const themeAudio = document.getElementById('themeAudio');
        if (themeAudio.paused) {
            themeAudio.play();
        } else {
            themeAudio.pause();
        }
    }

    // Add an event listener to the play button
    playButton.addEventListener('click', function() {
        handlePlayPause();
        // Assuming you want to notify the server when play/pause happens
        fetch('http://localhost:3000/play-pause', { method: 'POST' })
            .then(() => {
                console.log('Play-pause event sent to server');
            })
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.querySelector('.play-button');
    const themeAudio = document.getElementById('themeAudio');
    let isPlaying = false;

    // Function to handle play/pause behavior and button image
    const handlePlayPause = function () {
        if (isPlaying) {
            themeAudio.pause();
            playButton.innerHTML = '<img src="res/play-button.png" alt="Play Icon">';
        } else {
            themeAudio.play();
            playButton.innerHTML = '<img src="res/pause-button.png" alt="Stop Icon">';
        }
        isPlaying = !isPlaying;
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
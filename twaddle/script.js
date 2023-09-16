// Function to toggle the menu visibility
function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('show-menu');
}

// Add a click event listener to the menu toggle icon
document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);

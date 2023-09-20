// Selectors
let modal = document.getElementById("changeFriendsLocationModal");
let button = document.getElementById("buttonChangeFriendsLocation");
let closeButton = document.getElementsByClassName("closeButton")[0];

// When the user clicks on the open modal button, it opens the modal
button.onclick = function () {
	modal.style.display = "block";
	modal.classList.add("fadeIn");
};

// When the user clicks on the cross, it closes the modal
closeButton.onclick = function () {
	closeModal();
};

// Detect if the initial click is within the modal or not to prevent from closing the modal if we move the cursor outside while holding the click
window.addEventListener("mousedown", function (event) {
	if (event.target == modal) {
		modal.dataset.mouseDown = true;
	} else {
		modal.dataset.mouseDown = false;
	}
});

// When the user clicks outside the modal, it closes the modal
window.addEventListener("mouseup", function (event) {
	// Check if the initial click was also outside the modal
	if (event.target == modal && modal.dataset.mouseDown == "true") {
		modal.dataset.mouseDown = false;
		closeModal();
	}
});

// Function to close the modal with animation
export function closeModal() {
	modal.classList.add("fadeOut");
	setTimeout(() => {
		modal.style.display = "none";
		modal.classList.remove("fadeOut");
	}, 200);

	if (modal.classList.contains("fadeIn")) {
		modal.classList.remove("fadeIn");
	}
}

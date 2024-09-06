document.addEventListener("DOMContentLoaded", function () {
  const sliderCard = document.querySelector(".slider-card");

  // Listen for when the animation ends
  sliderCard.addEventListener("animationiteration", function () {
    sliderCard.style.animation = "none"; // Stop the animation
    sliderCard.style.transform = "translateX(0%)"; // Reset to the first image position

    // Force a reflow to ensure the animation restarts
    sliderCard.offsetHeight; // Trigger reflow

    // Restart the animation after resetting position
    sliderCard.style.animation = "slide 15s infinite ease-in-out";
  });
});

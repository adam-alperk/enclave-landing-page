document.addEventListener("DOMContentLoaded", function () {
  const sliderCard = document.querySelector(".slider-card");
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;
  let currentIndex = 0;

  function updateSlidePosition() {
    const offset = -currentIndex * 100;
    sliderCard.style.transform = `translateX(${offset}vw)`;
  }

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
  }

  function showPreviousSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
  }

  // Attach event listeners to the arrows
  document.querySelector(".right-arrow").addEventListener("click", () => {
    console.log("Right arrow clicked");
    showNextSlide();
  });

  document.querySelector(".left-arrow").addEventListener("click", () => {
    console.log("Left arrow clicked");
    showPreviousSlide();
  });

  // Optional: Auto-slide functionality
  setInterval(showNextSlide, 5000); // Change slide every 5 seconds
});

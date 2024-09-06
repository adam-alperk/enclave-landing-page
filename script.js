document.addEventListener("DOMContentLoaded", function () {
  const sliderCard = document.querySelector(".slider-card");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot"); // Select all dots
  const totalSlides = slides.length;
  const adjuster = ((totalSlides - 1) * 100) / 2;
  let currentIndex = 0;

  sliderCard.style.transform = `translateX(${adjuster}vw)`;

  function updateSlidePosition() {
    const offset = -currentIndex * 100 + adjuster;
    sliderCard.style.transform = `translateX(${offset}vw)`;
    updateDots(); // Update dots each time the slide position changes
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
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

  // Attach event listeners to the dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlidePosition();
    });
  });

  // Optional: Auto-slide functionality
  setInterval(showNextSlide, 5000); // Change slide every 5 seconds

  // Initialize dots
  updateDots();
});

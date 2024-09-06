document.addEventListener("DOMContentLoaded", function () {
  const sliderCard = document.querySelector(".slider-card");
  const slides = document.querySelectorAll(".slide");
  const listingsCard = document.querySelector(".listings-card");
  const listingImages = document.querySelectorAll(".listings-image-container");
  const dots = document.querySelectorAll(".dot");
  const listDots = document.querySelectorAll(".list-dot");
  const totalSlides = slides.length;
  const totalListings = listingImages.length;

  const slideWidth = 100;
  // const listingWidth = 30;
  let listingWidth = window.innerWidth < 1270 ? 80 : 30;

  const adjuster = ((totalSlides - 1) * slideWidth) / 2;
  const listingAdjuster = ((totalListings - 1) * listingWidth) / 2;

  let currentIndex = 0;
  let listingIndex = 0;
  let startX = 0;
  let endX = 0;

  sliderCard.style.transform = `translateX(${adjuster}vw)`;
  listingsCard.style.transform = `translateX(${listingAdjuster}vw)`;

  function updateSlidePosition() {
    const offset = -currentIndex * slideWidth + adjuster;
    sliderCard.style.transform = `translateX(${offset}vw)`;
    updateDots(); // Update dots each time the slide position changes
  }

  function updateListingsPosition() {
    const listOffset = -listingIndex * listingWidth + listingAdjuster; // Adjust the width if necessary
    listingsCard.style.transform = `translateX(${listOffset}vw)`;
    updateListDots();
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function updateListDots() {
    listDots.forEach((listdot, index) => {
      listdot.classList.toggle("active", index === listingIndex);
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

  function showNextListing() {
    listingIndex = (listingIndex + 1) % totalListings;
    updateListingsPosition();
  }

  function showPreviousListing() {
    listingIndex = (listingIndex - 1 + totalListings) % totalListings;
    updateListingsPosition();
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

  listDots.forEach((listdot, index) => {
    listdot.addEventListener("click", () => {
      listingIndex = index;
      updateListingsPosition();
    });
  });

  // Swipe functionality for mobile devices
  listingsCard.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  listingsCard.addEventListener("touchmove", (e) => {
    endX = e.touches[0].clientX;
  });

  listingsCard.addEventListener("touchend", () => {
    if (startX > endX + 50) {
      // Swipe left (next listing)
      showNextListing();
    } else if (startX < endX - 50) {
      // Swipe right (previous listing)
      showPreviousListing();
    }
  });

  // Optional: Auto-slide functionality
  setInterval(showNextSlide, 5000); // Change slide every 5 seconds
  setInterval(showNextListing, 5000);

  // Initialize dots
  updateDots();
  updateListDots();
});

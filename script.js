document.addEventListener("DOMContentLoaded", function () {
  const sliderCard = document.querySelector(".slider-card");
  const slides = document.querySelectorAll(".slide");
  const listingsCard = document.querySelector(".listings-card");
  const listingImages = document.querySelectorAll(".listings-image-container");
  const dots = document.querySelectorAll(".dot");
  const dotGroup = document.querySelector(".dots");
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

  setInterval(showNextListing, 5000);

  // Initialize dots
  updateDots();
  updateListDots();

  // Form integration with API

  const form = document.getElementById("enquiryForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!form.checkValidity()) {
      alert("Please fill all required fields.");
      return;
    }

    // Gather UTM data
    const urlParams = new URLSearchParams(window.location.search);
    const utmMedium = urlParams.get("utm_medium") || "";
    const utmSource = urlParams.get("utm_source") || "";
    const utmCampaign = urlParams.get("utm_campaign") || "";
    const utmSubSource = urlParams.get("utm_sub_source") || "";
    const utmAdCreative = urlParams.get("utm_adcreative") || "";
    const adName = urlParams.get("AdName") || "";
    const adSet = urlParams.get("Adset") || "";
    const keywords = urlParams.get("Keywords") || "";
    const placement = urlParams.get("Placement") || "";
    const adGroup = urlParams.get("Adgroup") || "";
    const url = window.location.href || "";

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    let device = "Unknown";
    if (/android/i.test(userAgent)) {
      device = "Android";
    } else if (/ipad|iphone|ipod/.test(userAgent) && !window.MSStream) {
      device = "iOS";
    } else if (/windows/.test(userAgent)) {
      device = "Windows";
    } else if (/macintosh/.test(userAgent)) {
      device = "Mac";
    } else if (/linux/.test(userAgent)) {
      device = "Linux";
    }

    // Gather form data
    const formData = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      contact: form.contact.value,
      email: form.email.value,
      residence: form.residence.value,
      preference: form.preference.value,
      countryCode: form.countryCodes.value,
    };

    // Salesforce login data (hardcode or get from input)
    const loginData = {
      grant_type: "password",
      client_id:
        "3MVG929eOx29turGporUIwGJGmKj4DFT.kDV5FCYnqt4A2Ee9DuasV_tnWXvukZZUnvwYWO2G_53310br3zaN",
      client_secret:
        "16F0BB05B992C9278D240A6C52813E5778454CD190D874DC1D41E3CF855069E2",
      username: "integration_user@nrisb.force.com",
      password: "Int@654321",
    };

    try {
      // Send login data to Salesforce Login API
      const loginResponse = await fetch(
        "https://login.salesforce.com/services/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(loginData).toString(),
        },
      );

      if (!loginResponse.ok) {
        throw new Error("Salesforce login failed");
      }

      const loginResult = await loginResponse.json();
      const accessToken = loginResult.access_token;
      const instanceUrl = loginResult.instance_url;

      // Console logging for debugging
      console.log("Access Token:", accessToken);
      console.log("Instance URL:", instanceUrl);

      // Prepare Lead Data for Create Lead API
      const leadData = {
        req: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobile: formData.contact,
          email: formData.email,
          budget: "Budget",
          configuration: formData.preference,
          countryCode: formData.countryCode,
          countryName: formData.residence,
          url: url,
          remarks: "Remarks",
          UTM_Medium: utmMedium,
          UTM_Source: utmSource,
          utm_sub_source: utmSubSource,
          utm_Campaign: utmCampaign,
          utm_adcreative: utmAdCreative,
          AdName: adName,
          Adset: adSet,
          Keywords: keywords,
          Placement: placement,
          Device: device,
          Adgroup: adGroup,
          LeadIdentifier: "post",
        },
      };

      // Send form data to Create Lead API
      const leadResponse = await fetch(
        `${instanceUrl}/services/apexrest/CreateLead/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadData),
        },
      );

      if (!leadResponse.ok) {
        throw new Error("Lead creation failed");
      }

      const leadResult = await leadResponse.json();
      console.log("Lead created successfully:", leadResult);
      alert("Form submitted successfully!");

      // Redirect after successful form submission
      window.location.href = "https://enclaveadvisory.com/thank-you/";
    } catch (error) {
      console.error("Error:", error);
      alert("Form submission failed. Please try again.");
    }
  });
});

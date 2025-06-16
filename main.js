// *****************like share and view***********************
document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded and DOM fully loaded."); // For debugging

    // Share Popup functionality
    document.querySelectorAll('.fa-share-alt').forEach((shareBtn, index) => {
        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('share-popup').style.display = 'block';
            const imgSrc = shareBtn.closest('.box').querySelector('img').src;
            document.getElementById('share-whatsapp').href = `https://wa.me/?text=${imgSrc}`;
            document.getElementById('share-instagram').href = `https://www.instagram.com/?url=${imgSrc}`;
            document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${imgSrc}`;
            document.getElementById('share-twitter').href = `https://twitter.com/share?url=${imgSrc}`;
            document.getElementById('share-telegram').href = `https://t.me/share/url?url=${imgSrc}`;
        });
    });

    document.querySelector('.close-popup').onclick = function() {
        document.getElementById('share-popup').style.display = 'none';
    };

    // Heart (like) functionality with sound and animation
    document.querySelectorAll('.fa-heart').forEach((heartBtn) => {
        heartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const likeSound = document.getElementById('like-sound');
            if (likeSound) likeSound.play(); // Check if sound element exists
            const heart = document.createElement('i');
            heart.classList.add('fas', 'fa-heart', 'heart-fly');
            document.body.appendChild(heart);
            heart.style.left = `${e.clientX}px`;
            heart.style.top = `${e.clientY}px`;
            heart.addEventListener('animationend', () => heart.remove());
        });
    });

    // Eye (view) functionality
    document.querySelectorAll('.fa-eye').forEach((eyeBtn) => {
        eyeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = eyeBtn.closest('.box').querySelector('img').src;
            document.getElementById('modal-image').src = imgSrc;
            document.getElementById('image-modal').style.display = 'flex';
        });
    });

    document.querySelector('.close-modal').onclick = function() {
        document.getElementById('image-modal').style.display = 'none';
    };

    document.getElementById('image-modal').onclick = function(e) {
        if (e.target === document.getElementById('image-modal')) {
            document.getElementById('image-modal').style.display = 'none';
        }
    };
});




// ***************************Home Banner container******************
let currentSlide = 0;
const slides = document.querySelectorAll('.slide'); // Ensure these elements exist in your HTML
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Autoplay function
if (slides.length > 0) { // Only start autoplay if slides exist
    let autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds

    // Pause autoplay on mouse enter and resume on mouse leave
    const slidesContainer = document.querySelector('.slides-container');
    if (slidesContainer) {
        slidesContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        slidesContainer.addEventListener('mouseleave', () => autoPlayInterval = setInterval(nextSlide, 5000));
    }

    // Event listeners for manual navigation
    const nextSlideBtn = document.getElementById('next-slide');
    const prevSlideBtn = document.getElementById('prev-slide');
    if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);
}


// **************************************************************

// Add download functionality to each download icon
document.querySelectorAll('.fa-download').forEach((downloadButton, index) => {
    downloadButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior

        // Get the image URL from the `href` attribute of the download icon
        const imageUrl = downloadButton.getAttribute('href');

        // Set a custom filename (optional)
        const fileName = `gallery-image-${index + 1}.jpg`;

        // Create an anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = imageUrl;
        anchor.download = fileName;

        // Trigger download
        anchor.click();
    });
});

// **************************************************************

// Select the video and mute button elements
const aboutVideo = document.getElementById('about-video');
const muteButton = document.getElementById('mute-toggle');

function updateMuteIcon() {
  if (aboutVideo.muted) {
    muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
}

function toggleMute() {
  if (aboutVideo) {
    aboutVideo.muted = !aboutVideo.muted;
    updateMuteIcon();
  }
}

// Ensure video starts unmuted (some browsers may override this)
aboutVideo.muted = false;
aboutVideo.addEventListener('loadedmetadata', () => {
  aboutVideo.muted = false;
  updateMuteIcon();
});

muteButton.addEventListener('click', toggleMute);


// IntersectionObserver to autoplay the video when section is in view
const aboutSection = document.querySelector('.about');
if (aboutVideo && aboutSection) { // Only observe if both elements exist
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutVideo.play();
            } else {
                aboutVideo.pause();
            }
        });
    }, { threshold: 0.5 }); // Adjust threshold as needed

    observer.observe(aboutSection);
}


// **************************************************************


const reviewContainer = document.querySelector(".review-container");

function cloneReviews() {
    const boxes = document.querySelectorAll(".review .box");
    boxes.forEach((box) => {
        const clone = box.cloneNode(true);
        if (reviewContainer) reviewContainer.appendChild(clone);
    });
}

// Clone reviews to enable smooth cycling
if (reviewContainer) {
    cloneReviews();
}


const reviewBoxes = document.querySelectorAll(".review .box");
const viewAllButton = document.querySelector(".review .view-all");

reviewBoxes.forEach(box => {
    box.addEventListener("mouseenter", () => {
        if (viewAllButton) viewAllButton.classList.add("hidden");
    });

    box.addEventListener("mouseleave", () => {
        if (viewAllButton) viewAllButton.classList.remove("hidden");
    });
});


// **************************************************************

let navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('#menu-btn');

if (menuBtn) {
    menuBtn.onclick = () => {
        if (navbar) navbar.classList.toggle('active');
    }
}

window.onscroll = () => {
    if (navbar) navbar.classList.remove('active');
    // Also remove other active classes on scroll if they are open
    const searchForm = document.querySelector('.search-form');
    const shoppingCart = document.querySelector('.shopping-cart');
    // REMOVED: const loginForm = document.querySelector('.login-form:not(#loggedInUserPanel)');
    // We don't want main.js to interact with any loginForm toggle
    if (searchForm) searchForm.classList.remove('active');
    if (shoppingCart) shoppingCart.classList.remove('active');
    // REMOVED: if (loginForm) loginForm.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');
const searchBtn = document.querySelector('#search-btn');

if (searchBtn) {
    searchBtn.onclick = () => {
        if (searchForm) searchForm.classList.toggle('active');
        // Close other elements
        const shoppingCart = document.querySelector('.shopping-cart');
        // REMOVED: const loginForm = document.querySelector('.login-form:not(#loggedInUserPanel)');
        const navbar = document.querySelector('.navbar');
        if (shoppingCart) shoppingCart.classList.remove('active');
        // REMOVED: if (loginForm) loginForm.classList.remove('active');
        if (navbar) navbar.classList.remove('active');
    }
}


let shoppingCart = document.querySelector('.shopping-cart');
const cartBtn = document.querySelector('#cart-btn');

if (cartBtn) {
    cartBtn.onclick = () => {
        if (shoppingCart) shoppingCart.classList.toggle('active');
        // Close other elements
        const searchForm = document.querySelector('.search-form');
        // REMOVED: const loginForm = document.querySelector('.login-form:not(#loggedInUserPanel)');
        const navbar = document.querySelector('.navbar');
        if (searchForm) searchForm.classList.remove('active');
        // REMOVED: if (loginForm) loginForm.classList.remove('active');
        if (navbar) navbar.classList.remove('active');
    }
}

// Swiper initialization (assuming Swiper library is imported in HTML)
var swiper = new Swiper(".box-container", {
    loop:true,
    spaceBetween: 20,
    autoplay: {
      delay: 7500,
      disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1020: {
        slidesPerView: 3,
      },
    },
});

//  *****************like share and view***********************
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
            likeSound.play();
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
const slides = document.querySelectorAll('.slide');
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
let autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds

// Pause autoplay on mouse enter and resume on mouse leave
const slidesContainer = document.querySelector('.slides-container');
slidesContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
slidesContainer.addEventListener('mouseleave', () => autoPlayInterval = setInterval(nextSlide, 5000));

// Event listeners for manual navigation
document.getElementById('next-slide').addEventListener('click', nextSlide);
document.getElementById('prev-slide').addEventListener('click', prevSlide);



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

// Function to toggle mute/unmute
function toggleMute() {
    if (aboutVideo.muted) {
        aboutVideo.muted = false;
        muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        aboutVideo.muted = true;
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Event listener for mute button click
muteButton.addEventListener('click', toggleMute);

// IntersectionObserver to autoplay the video when section is in view
const aboutSection = document.querySelector('.about');
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


// **************************************************************


const reviewContainer = document.querySelector(".review-container");

function cloneReviews() {
    const boxes = document.querySelectorAll(".review .box");
    boxes.forEach((box) => {
        const clone = box.cloneNode(true);
        reviewContainer.appendChild(clone);
    });
}

// Clone reviews to enable smooth cycling
cloneReviews();


const reviewBoxes = document.querySelectorAll(".review .box");
const viewAllButton = document.querySelector(".review .view-all");

reviewBoxes.forEach(box => {
    box.addEventListener("mouseenter", () => {
        viewAllButton.classList.add("hidden");
    });

    box.addEventListener("mouseleave", () => {
        viewAllButton.classList.remove("hidden");
    });
});


// **************************************************************

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
}

// let slides = document.querySelectorAll('.home .slides-container .slide');
// let index = 0;

function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () =>{
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
} 

let shoppingCart = document.querySelector('.shopping-cart');

document.querySelector('#cart-btn').onclick = () =>{
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
} 

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


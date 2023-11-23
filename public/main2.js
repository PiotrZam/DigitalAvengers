let slideIndex = 0;

function showSlides() {
    const slides = document.querySelectorAll('.carousel-slide');
    const track = document.querySelector('.carousel-track');

    if (slideIndex === slides.length) {
        slideIndex = 0;
    } else if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    const translateValue = -slideIndex * 100 + '%';
    track.style.transform = 'translateX(' + translateValue + ')';
}

function plusSlides(n) {
    slideIndex += n;
    showSlides();
}

// Display the first slide
showSlides();

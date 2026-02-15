document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('#pharmacyCarousel');

    if (carousel) {
        // Pause on hover for better user experience
        carousel.addEventListener('mouseenter', function () {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) {
                bsCarousel.pause();
            }
        });

        carousel.addEventListener('mouseleave', function () {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) {
                bsCarousel.cycle();
            }
        });

        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                const bsCarousel = bootstrap.Carousel.getInstance(carousel);
                if (bsCarousel) {
                    if (diff > 0) {
                        // Swipe left - next slide
                        bsCarousel.next();
                    } else {
                        // Swipe right - prev slide
                        bsCarousel.prev();
                    }
                }
            }
        }

        console.log('Carousel initialized with enhanced features');
    }

    // Fix logo carousel - immediately hide non-active slides
    const logoCarousel = document.querySelector('#logoCarousel');
    if (logoCarousel) {
        const items = logoCarousel.querySelectorAll('.carousel-item');
        items.forEach(function (item) {
            if (!item.classList.contains('active')) {
                item.style.display = 'none';
            }
        });

        // Listen for slide events to update display
        logoCarousel.addEventListener('slid.bs.carousel', function () {
            items.forEach(function (item) {
                if (item.classList.contains('active')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

"use strict";

document.addEventListener('DOMContentLoaded', function() {
    // Get the button element
    const backToTopBtn = document.getElementById('backToTop');
    
    // Check if button exists before proceeding
    if (!backToTopBtn) {
        return;
    }

    let scrollTimer = null;

    // Function to handle scroll events
    function handleScroll() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(() => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, 50); // Small delay to prevent too frequent updates
    }

    // Function to scroll to top
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Add click event listener
    backToTopBtn.addEventListener('click', scrollToTop);

    // Add keyboard accessibility
    backToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            scrollToTop(e);
        }
    });

    // Initial check in case page is already scrolled
    handleScroll();
});

// Alternative: If you can't use DOMContentLoaded, use this fallback
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) {
        // If button not found, try again after a short delay
        setTimeout(initBackToTop, 50);
        return;
    }
}
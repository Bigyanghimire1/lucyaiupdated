document.addEventListener('DOMContentLoaded', function() {
    // Get loading screen element
    const loadingScreen = document.querySelector('.loading-screen');
    
    // If loading screen exists, handle its animation
    if (loadingScreen) {
        // Hide loading screen after 1 second with a fade out
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // Animate hexagon with GSAP if it exists and GSAP is loaded
    if (window.gsap && document.querySelector('.hex-path')) {
        gsap.to('.hex-path', {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.out'
        });
        
        gsap.to('.lines-container .line', {
            height: '100%',
            duration: 1,
            stagger: 0.2,
            ease: 'power1.out',
            delay: 0.5
        });
    }
}); 
// Main JavaScript for ByteFest 2K25

function initByteFest() {
  // Smooth scroll init
  new SmoothScroll('a[href*="#"]', { speed: 800, offset: 80 });

  // New countdown logic targeting 08 June, 2025
  function updateCountdown() {
    const now = new Date();
    const target = new Date(2025, 5, 9); // months are 0-based (5 = June)
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    // Update Alpine.js data if available
    if (document.body.__x && document.body.__x.$data) {
      Object.assign(document.body.__x.$data, {
        countdownDays: days,
        countdownHours: hours,
        countdownMinutes: minutes,
        countdownSeconds: seconds
      });
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scroll-in animations via Intersection Observer
  const faders = document.querySelectorAll('.fade-in');
  const observerOpts = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
  const appearOnScroll = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, observerOpts);

  faders.forEach(el => appearOnScroll.observe(el));

  // Particles background (if library loaded and container present)
  if (window.particlesJS && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60 },
        size: { value: 2 },
        color: { value: '#3b82f6' },
        line_linked: { enable: true, color: '#3b82f6', opacity: 0.2 },
        move: { speed: 1 }
      },
      interactivity: { events: { onhover: { enable: true, mode: 'repulse' } } },
      retina_detect: true
    });
  }

  // Subtle parallax for sections with data-parallax="bg"
  const parallaxSections = document.querySelectorAll('[data-parallax="bg"]');
  if (parallaxSections.length) {
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      parallaxSections.forEach(el => {
        el.style.backgroundPosition = `center ${-y * 0.15}px`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Initialize AOS if present
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
    // Ensure elements visible on anchor jumps / late loads
    AOS.refresh();
    setTimeout(() => {
      AOS.refreshHard();
    }, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initByteFest);
} else {
  // DOM already ready, run immediately
  initByteFest();
}

// Notice marquee functionality
function initNoticeMarquee() {
  const track = document.getElementById('noticeTrack');
  if (track) {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  }
}

// Initialize notice marquee when DOM is loaded
document.addEventListener('DOMContentLoaded', initNoticeMarquee);

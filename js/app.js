// ByteFest 2K25 consolidated script (from js/main.js + inline initializations)

function initByteFest() {
  // Smooth scroll init (if library present)
  if (window.SmoothScroll) {
    new SmoothScroll('a[href*="#"]', { speed: 800, offset: 80 });
  }

  // Countdown (target June 9, 2025)
  function updateCountdown() {
    const now = new Date();
    const target = new Date(2025, 5, 9);
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

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

  // Parallax layers removed for clean, unobstructed content

  // Custom scroll animation for Overview section
  function initOverviewSlideAnimation() {
    const overviewSection = document.querySelector('#overview');
    const leftContent = overviewSection?.querySelector('.md\\:w-1\\/2:first-child');
    const rightImage = overviewSection?.querySelector('.md\\:w-1\\/2:last-child');
    
    if (!overviewSection || !leftContent || !rightImage) return;
    
    let hasAnimated = false;
    
    // Set initial positions
    leftContent.style.transform = 'translateX(-150px)';
    leftContent.style.opacity = '0';
    rightImage.style.transform = 'translateX(150px)';
    rightImage.style.opacity = '0';
    
    // Add smooth transition
    leftContent.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1s ease-out';
    rightImage.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1s ease-out';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          
          // Left content slides in from left
          setTimeout(() => {
            leftContent.style.transform = 'translateX(0)';
            leftContent.style.opacity = '1';
          }, 300);
          
          // Right image slides in from right (staggered)
          setTimeout(() => {
            rightImage.style.transform = 'translateX(0)';
            rightImage.style.opacity = '1';
          }, 600);
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(overviewSection);
  }
  
  // Initialize overview slide animation
  initOverviewSlideAnimation();

  // Custom slide animation for Highlights section
  function initHighlightsSlideAnimation() {
    const highlightsSection = document.querySelector('#highlights');
    const highlightCards = highlightsSection?.querySelectorAll('.highlight-card');
    
    if (!highlightsSection || !highlightCards || !highlightCards.length) return;

    // Group cards into visual rows based on their vertical position
    const rows = [];
    const tolerancePx = 24; // allow small layout differences
    highlightCards.forEach((card) => {
      const top = card.offsetTop;
      let row = rows.find(r => Math.abs(r.top - top) <= tolerancePx);
      if (!row) {
        row = { top, items: [] };
        rows.push(row);
      }
      row.items.push(card);
    });
    // Ensure rows are top-to-bottom
    rows.sort((a, b) => a.top - b.top);

    // Initialize positions per row: even rows from left, odd rows from right
    const slideDistance = 200;
    rows.forEach((row, rowIndex) => {
      const fromLeft = rowIndex % 2 === 0;
      row.items.forEach((card) => {
        card.style.transform = fromLeft ? `translateX(-${slideDistance}px)` : `translateX(${slideDistance}px)`;
        card.style.opacity = '0';
        card.style.transition = 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.9s ease-out';
      });
    });

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          // Animate by rows with stagger between rows and within each row
          rows.forEach((row, rowIndex) => {
            row.items.forEach((card, i) => {
              setTimeout(() => {
                card.style.transform = 'translateX(0)';
                card.style.opacity = '1';
              }, rowIndex * 250 + i * 150);
            });
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(highlightsSection);
  }
  
  // Initialize highlights slide animation
  initHighlightsSlideAnimation();

  // Initialize AOS if present
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
    setTimeout(() => { AOS.refreshHard(); }, 100);
  }

  // Custom glowing cursor
  (function initCustomCursor(){
    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    document.body.appendChild(cursor);
    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;
    let mouseX = posX;
    let mouseY = posY;
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
    function render(){
      posX = lerp(posX, mouseX, 0.2);
      posY = lerp(posY, mouseY, 0.2);
      cursor.style.transform = `translate(${posX}px, ${posY}px)`;
      requestAnimationFrame(render);
    }
    render();
  })();

  // Vanilla tilt for highlight cards (progressive enhancement)
  (function initTilt(){
    const cards = document.querySelectorAll('.highlight-card');
    if (!cards.length) return;
    const constrain = 15;
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const rx = ((cy - rect.height / 2) / rect.height) * -constrain;
        const ry = ((cx - rect.width / 2) / rect.width) * constrain;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      });
    });
  })();

  // Decode text effect on reveal
  (function initDecode(){
    const elements = document.querySelectorAll('[data-decode]');
    if (!elements.length) return;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    function decode(el){
      const finalText = el.dataset.decode || el.textContent;
      let frame = 0;
      const total = 20;
      const interval = setInterval(() => {
        const progress = frame/total;
        const out = finalText.split('').map((ch, i) => {
          if (i < Math.floor(progress * finalText.length)) return finalText[i];
          return charset[Math.floor(Math.random()*charset.length)];
        }).join('');
        el.textContent = out;
        frame++;
        if (frame > total) { el.textContent = finalText; clearInterval(interval); }
      }, 30);
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { decode(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    elements.forEach(el => io.observe(el));
  })();

  // Schedule line-drawing setup (SVG injected into schedule section)
  (function initScheduleLine(){
    const scheduleSection = document.querySelector('#schedule .container');
    if (!scheduleSection) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('schedule-line');
    const path = document.createElementNS(svgNS, 'path');
    svg.appendChild(path);
    scheduleSection.appendChild(svg);
    function updatePath(){
      const items = scheduleSection.querySelectorAll('.schedule-item');
      if (!items.length) return;
      const points = [];
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        const containerR = scheduleSection.getBoundingClientRect();
        const x = 40;
        const y = r.top - containerR.top + r.height/2 + window.scrollY;
        points.push([x, y]);
      });
      let d = '';
      points.forEach(([x, y], i) => {
        d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
      });
      path.setAttribute('d', d);
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length - (window.scrollY + window.innerHeight - scheduleSection.offsetTop) * 0.6;
    }
    updatePath();
    window.addEventListener('scroll', updatePath, { passive: true });
    window.addEventListener('resize', updatePath);
  })();

  // Pop-up animation for Schedule items
  function initSchedulePopAnimation() {
    const container = document.querySelector('#schedule .container');
    if (!container) return;
    const items = container.querySelectorAll('.schedule-item');
    if (!items.length) return;

    // Initial state: scaled down and faded out
    items.forEach((el) => {
      el.style.transform = 'scale(0.92) translateY(20px)';
      el.style.opacity = '0';
      el.style.transition = 'transform 600ms ease-out, opacity 600ms ease-out';
      el.style.willChange = 'transform, opacity';
    });

    let hasAnimated = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          // Staggered pop-in
          items.forEach((el, i) => {
            setTimeout(() => {
              el.style.transform = 'scale(1) translateY(0)';
              el.style.opacity = '1';
            }, i * 120);
          });
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    io.observe(container);
  }

  // Initialize schedule pop animation
  initSchedulePopAnimation();

  // Cursor-following spider/venom animation (runs on homepage, overview, and highlights sections)
  function initSpiderCursor() {
    /* ===== CORRECT - Fluid Spider/Venom Cursor from Video ===== */
    const canvases = [
      document.getElementById('canvas'),
      document.getElementById('canvas-overview'),
      document.getElementById('canvas-highlights')
    ].filter(canvas => canvas !== null);
    
    // Only run this animation if at least one canvas exists.
    if (!canvases.length) return;

    let w, h;
    const { sin, cos, PI, hypot, min, max } = Math;

    // All helper functions from the original script
    function rnd(x = 1, dx = 0) { return Math.random() * x + dx; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function many(n, f) { return [...Array(n)].map((_, i) => f(i)); }
    function pt(x, y) { return { x, y }; }
    function noise(x, y, t = 101) {
        let w0 = sin(0.3 * x + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y + -1.3 * t + 1.0));
        let w1 = sin(0.2 * y + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x + -1.2 * t + 0.5));
        return w0 + w1;
    }
    function drawCircle(ctx, x, y, r) {
        ctx.beginPath();
        ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
        ctx.fill();
    }
    function drawLine(ctx, x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        many(100, (i) => {
            i = (i + 1) / 100;
            let x = lerp(x0, x1, i);
            let y = lerp(y0, y1, i);
            let k = noise(x / 5 + x0, y / 5 + y0) * 2;
            ctx.lineTo(x + k, y + k);
        });
        ctx.stroke();
    }

    // The main "spider" creation function, adapted from the original
    function spawn(canvasWidth, canvasHeight) {
        const pts = many(333, () => {
            return {
                x: rnd(canvasWidth),
                y: rnd(canvasHeight),
                len: 0,
                r: 0
            };
        });
        const pts2 = many(9, (i) => {
            return {
                x: cos((i / 9) * PI * 2),
                y: sin((i / 9) * PI * 2)
            };
        });

        let seed = rnd(100);
        let tx = rnd(canvasWidth);
        let ty = rnd(canvasHeight);
        let x = rnd(canvasWidth);
        let y = rnd(canvasHeight);
        let kx = rnd(0.5, 0.5);
        let ky = rnd(0.5, 0.5);
        let walkRadius = pt(rnd(50, 50), rnd(50, 50));
        let r = canvasWidth / rnd(100, 150);

        function paintPt(ctx, pt) {
            pts2.forEach((pt2) => {
                if (!pt.len) return;
                drawLine(ctx,
                    lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                    lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                    x + pt2.x * r,
                    y + pt2.y * r
                );
            });
            drawCircle(ctx, pt.x, pt.y, pt.r);
        }

        return {
            follow(x, y) {
                tx = x;
                ty = y;
            },
            tick(ctx, t, canvasWidth, canvasHeight) {
                const selfMoveX = cos(t * kx + seed) * walkRadius.x;
                const selfMoveY = sin(t * ky + seed) * walkRadius.y;
                let fx = tx + selfMoveX;
                let fy = ty + selfMoveY;

                x += min(canvasWidth / 100, (fx - x) / 10);
                y += min(canvasHeight / 100, (fy - y) / 10);

                let i = 0;
                pts.forEach((pt) => {
                    const dx = pt.x - x;
                    const dy = pt.y - y;
                    const len = hypot(dx, dy);
                    let r = min(2, canvasWidth / len / 5);
                    const increasing = len < canvasWidth / 10 && (i++) < 8;
                    let dir = increasing ? 0.1 : -0.1;
                    if (increasing) {
                        r *= 1.5;
                    }
                    pt.r = r;
                    pt.len = max(0, min(pt.len + dir, 1));
                    paintPt(ctx, pt);
                });
            }
        };
    }

    // Create spider instances for each canvas
    const canvasSpiders = canvases.map((canvas) => {
        const rect = canvas.getBoundingClientRect();
        return many(2, () => spawn(rect.width, rect.height));
    });

    window.addEventListener("pointermove", (e) => {
        canvases.forEach((canvas, canvasIndex) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only follow if mouse is over this canvas
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                canvasSpiders[canvasIndex].forEach(spider => {
                    spider.follow(x, y);
                });
            }
        });
    });

    // Create a transparent star field overlay (no black fill)
    let stars = [];
    function regenStars() {
      stars = many(180, () => ({ x: rnd(innerWidth), y: rnd(innerHeight), r: rnd(0.9, 0.1) }));
    }
    regenStars();
    
    // Generate stars for each canvas
    const canvasStars = canvases.map((canvas) => {
        const rect = canvas.getBoundingClientRect();
        return many(60, () => ({ x: rnd(rect.width), y: rnd(rect.height), r: rnd(0.9, 0.1) }));
    });

    // The main animation loop
    requestAnimationFrame(function anim(t) {
        if (w !== innerWidth) { 
            w = innerWidth; 
            regenStars();
        }
        if (h !== innerHeight) { 
            h = innerHeight; 
            regenStars();
        }

        // Animate each canvas
        canvases.forEach((canvas, canvasIndex) => {
            const ctx = canvas.getContext("2d");
            const rect = canvas.getBoundingClientRect();
            
            // Set canvas size to match its display size
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            // Keep canvas transparent so underlying backgrounds remain visible
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw subtle white stars
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            canvasStars[canvasIndex].forEach(s => { 
                ctx.fillRect(s.x, s.y, s.r, s.r); 
            });

            ctx.fillStyle = ctx.strokeStyle = "#fff";
            t /= 1000;

            canvasSpiders[canvasIndex].forEach(spider => spider.tick(ctx, t, canvas.width, canvas.height));
        });

        requestAnimationFrame(anim);
    });
  }

  // Initialize spider cursor
  initSpiderCursor();

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initByteFest);
} else {
  initByteFest();
}

// Notice marquee clone for seamless loop
function initNoticeMarquee() {
  const track = document.getElementById('noticeTrack');
  if (track) {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
  }
}
document.addEventListener('DOMContentLoaded', initNoticeMarquee);



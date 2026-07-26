document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     SPA VIEW NAVIGATION TRANSITIONS
     ========================================================================== */
  const navBtns = document.querySelectorAll('.nav-btn, .logo-link');
  const viewSections = document.querySelectorAll('.view-section');

  const switchView = (targetId) => {
    const currentActive = document.querySelector('.view-section.active');
    const targetView = document.getElementById(`${targetId}-view`);
    
    if (!targetView || currentActive === targetView) return;

    // 1. Play exit transition on current active section
    if (currentActive) {
      currentActive.classList.remove('active');
      currentActive.classList.add('exiting');
      
      // Wait for exit animation to finish
      setTimeout(() => {
        currentActive.classList.remove('exiting');
        
        // 2. Play entry transition on target section
        targetView.classList.add('entering');
        setTimeout(() => {
          targetView.classList.remove('entering');
          targetView.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Re-trigger scroll reveal evaluation
          triggerScrollReveal();
        }, 50);
      }, 350);
    } else {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      triggerScrollReveal();
    }

    // Update Nav Button Active States
    navBtns.forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update URL hash
    window.location.hash = targetId;
  };

  // Bind navigation listeners
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        switchView(targetId);
        closeMobileMenu();
      }
    });
  });

  // Handle URL hash on load
  const initRouting = () => {
    const hash = window.location.hash.substring(1);
    const validViews = ['home', 'projects', 'resume', 'about'];
    if (hash && validViews.includes(hash)) {
      switchView(hash);
    } else {
      switchView('home');
    }
  };

  /* ==========================================================================
     MOBILE HAMBURGER NAV TOGGLE
     ========================================================================== */
  const hamburger = document.getElementById('hamburger-menu');
  const mobileNav = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('close-overlay-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (mobileNav) {
      mobileNav.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', openMobileMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }

  // Bind mobile link navigation
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (targetId) {
        switchView(targetId);
      }
    });
  });

  /* ==========================================================================
     AMBIENT CURSOR GLOW
     ========================================================================== */
  const glow = document.createElement('div');
  glow.classList.add('cursor-glow');
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });

  /* ==========================================================================
     TOPOGRAPHIC LINES BACKGROUND CANVAS
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    });

    const points = [];
    const numPoints = 12;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 150 + 150
      });
    }

    const drawTopography = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.025)';
      ctx.lineWidth = 1;

      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (let r = 20; r < 350; r += 24) {
        points.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + (Math.sin(Date.now() * 0.001 + p.x) * 5), 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      requestAnimationFrame(drawTopography);
    };

    drawTopography();
  }

  /* ==========================================================================
     LIGHTBOX VISUAL CREDENTIALS VIEWER
     ========================================================================== */
  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const certCards = document.querySelectorAll('.cert-card-trigger');

  const openLightbox = (imgSrc, imgAlt) => {
    if (lightbox && lightboxImage) {
      lightboxImage.src = imgSrc;
      lightboxImage.alt = imgAlt;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
    }
  };

  if (lightbox && certCards.length > 0) {
    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-cert-img');
        const imgAlt = card.querySelector('.cert-card-title')?.textContent || 'Certificate';
        if (imgSrc) {
          openLightbox(imgSrc, imgAlt);
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ==========================================================================
     SCROLL REVEAL INTERSECTION OBSERVER
     ========================================================================== */
  let revealObserver;
  const triggerScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if (revealObserver) {
      revealObserver.disconnect();
    }

    if ('IntersectionObserver' in window && revealElements.length > 0) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
      });

      revealElements.forEach(el => {
        el.classList.remove('active');
        revealObserver.observe(el);
      });
    } else {
      revealElements.forEach(el => el.classList.add('active'));
    }
  };

  /* ==========================================================================
     3D CARD TILT INTERACTION
     ========================================================================== */
  const bind3DTilt = () => {
    const tiltCards = document.querySelectorAll('.project-card, .project-item-full, .cert-grid-card, .skill-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = (x - xc) / xc;
        const dy = (y - yc) / yc;
        
        const rx = -dy * 6;
        const ry = dx * 6;
        
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  };

  // Initialize Routing & Interactions
  initRouting();
  triggerScrollReveal();
  bind3DTilt();

});

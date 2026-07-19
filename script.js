document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     PROGRESSIVE ENHANCEMENT: SIGNAL JS ACTIVE
     ========================================================================== */
  document.body.classList.add('js-enabled');

  /* ==========================================================================
     STICKY HEADER STATE MANAGEMENT
     ========================================================================== */
  const header = document.getElementById('main-header');
  const isHomePage = !!document.getElementById('hero-section');
  
  const handleScroll = () => {
    if (!header) return;
    if (!isHomePage) {
      header.classList.add('scrolled');
      return;
    }
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ==========================================================================
     MOBILE HAMBURGER MENU
     ========================================================================== */
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    };

    const closeMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ==========================================================================
     SCROLL REVEAL INTERSECTION OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length > 0) {
    const revealOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    };

    const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    revealElements.forEach(element => {
      revealOnScrollObserver.observe(element);
    });
  }

  // Safety Fallback: Automatically reveal all scroll-reveal elements after 600ms
  // in case the IntersectionObserver callback is blocked or doesn't fire (e.g. nested frames)
  setTimeout(() => {
    document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
  }, 600);

  /* ==========================================================================
     LIGHTBOX FEATURE FOR PORTFOLIO AND AWARDS
     ========================================================================== */
  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  if (lightbox && lightboxImg && lightboxClose) {
    const awardImages = document.querySelectorAll('.award-img-wrapper img');
    const portfolioImages = document.querySelectorAll('.portfolio-item-img-wrapper img');
    const portfolioButtons = document.querySelectorAll('.portfolio-arrow-btn');

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Full size view';
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    };

    awardImages.forEach(img => {
      img.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
      });
    });

    portfolioImages.forEach(img => {
      img.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
      });
    });

    portfolioButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.portfolio-item-card');
        if (card) {
          const img = card.querySelector('.portfolio-item-img');
          if (img) {
            openLightbox(img.src, img.alt);
          }
        }
      });
    });

    // Certifications Lightbox Trigger
    const certCards = document.querySelectorAll('.cert-card-item');
    certCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-cert-img');
        const imgAlt = card.querySelector('.cert-card-name')?.textContent || 'Certificate';
        if (imgSrc) {
          openLightbox(imgSrc, imgAlt);
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
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
     CONTACT FORM VALIDATION & SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    const formSuccess = document.getElementById('form-success');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    const isValidEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const validateInput = (input, errorElement, validationFn, conditionMsg) => {
      const parent = input.parentElement;
      const val = input.value.trim();
      let isValid = true;

      if (val === '') {
        parent.classList.add('invalid');
        errorElement.textContent = 'This field is required';
        isValid = false;
      } else if (validationFn && !validationFn(val)) {
        parent.classList.add('invalid');
        errorElement.textContent = conditionMsg || 'Invalid input';
        isValid = false;
      } else {
        parent.classList.remove('invalid');
      }

      return isValid;
    };

    if (nameInput) {
      nameInput.addEventListener('blur', () => validateInput(nameInput, document.getElementById('name-error')));
    }
    if (emailInput) {
      emailInput.addEventListener('blur', () => validateInput(emailInput, document.getElementById('email-error'), isValidEmail, 'Please enter a valid email address'));
    }
    if (messageInput) {
      messageInput.addEventListener('blur', () => validateInput(messageInput, document.getElementById('message-error')));
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateInput(nameInput, document.getElementById('name-error'));
      const isEmailValid = validateInput(emailInput, document.getElementById('email-error'), isValidEmail, 'Please enter a valid email address');
      const isMessageValid = validateInput(messageInput, document.getElementById('message-error'));

      if (isNameValid && isEmailValid && isMessageValid) {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
        }

        // POST request to Formspree endpoint (form action URL)
        fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            contactForm.style.display = 'none';
            if (formSuccess) {
              formSuccess.style.display = 'block';
              formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } else {
            response.json().then(data => {
              if (Object.hasOwn(data, 'errors')) {
                alert(data["errors"].map(error => error["message"]).join(", "));
              } else {
                alert("Oops! There was a problem submitting your form. Make sure the Formspree endpoint key in index.html action attribute is set correctly.");
              }
            });
          }
        })
        .catch(error => {
          alert("Oops! There was a network problem submitting your form.");
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
          }
        });
      }
    });
  }

});

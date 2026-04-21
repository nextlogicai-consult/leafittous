document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar Scroll Effect ───
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── Active Nav Link Highlight ───
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── Mobile Menu Toggle ───
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  mobileBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('hidden', !menuOpen);
    mobileBtn.innerHTML = menuOpen
      ? '<i class="fas fa-times text-xl"></i>'
      : '<i class="fas fa-bars text-xl"></i>';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.add('hidden');
      mobileBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
    });
  });

  // ─── Scroll Fade-Up Animations ───
  const fadeElements = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.animationDelay || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, ms);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ─── Back to Top Button ───
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Quote Form Submission ───
  const quoteForm = document.getElementById('quote-form');
  const quoteSuccess = document.getElementById('quote-success');

  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = quoteForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
    btn.disabled = true;

    const formData = new FormData(quoteForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (result.success) {
        quoteSuccess.textContent = result.message;
        quoteSuccess.classList.remove('hidden');
        quoteForm.reset();
        setTimeout(() => quoteSuccess.classList.add('hidden'), 6000);
      } else {
        quoteSuccess.textContent = result.error || 'Something went wrong. Please try again.';
        quoteSuccess.classList.remove('hidden');
      }
    } catch {
      quoteSuccess.textContent = 'Network error. Please try again later.';
      quoteSuccess.classList.remove('hidden');
    }

    btn.innerHTML = originalHTML;
    btn.disabled = false;
  });

  // ─── Contact Form Submission ───
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
    btn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (result.success) {
        contactSuccess.textContent = result.message;
        contactSuccess.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => contactSuccess.classList.add('hidden'), 6000);
      } else {
        contactSuccess.textContent = result.error || 'Something went wrong. Please try again.';
        contactSuccess.classList.remove('hidden');
      }
    } catch {
      contactSuccess.textContent = 'Network error. Please try again later.';
      contactSuccess.classList.remove('hidden');
    }

    btn.innerHTML = originalHTML;
    btn.disabled = false;
  });

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

});

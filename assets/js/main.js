// Tinspol Motors Landing Page Interactions
// - Sticky header background on scroll
// - Mobile nav toggle
// - Reveal on scroll animations
// - Parallax hero
// - Promo countdown timers
// - Gallery filter + lightbox
// - Testimonial slider

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Header scroll state
  const header = $('#site-header');
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const navToggle = $('#navToggle');
  const navList = $('#navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on link click
    navList.addEventListener('click', (e) => {
      if (e.target.matches('a')) navList.classList.remove('open');
    });
  }

  // Reveal on scroll
  const revealEls = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.18 });
  revealEls.forEach((el) => io.observe(el));

  // Parallax hero
  const heroBg = $('[data-parallax]');
  if (heroBg) {
    const parallax = () => {
      const y = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener('scroll', parallax, { passive: true });
  }

  // Countdown timers
  const countdowns = $$('.countdown');
  function updateCountdown(el) {
    const deadline = new Date(el.dataset.deadline).getTime();
    const now = Date.now();
    const diff = Math.max(0, deadline - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    el.textContent = diff === 0 ? 'Offer ended' : `${days}d ${hours}h ${mins}m ${secs}s`;
  }
  if (countdowns.length) {
    countdowns.forEach((el) => updateCountdown(el));
    setInterval(() => countdowns.forEach(updateCountdown), 1000);
  }

  // Gallery filter
  const filterBtns = $$('.filter-btn');
  const items = $$('.gallery-item');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach((it) => {
        const show = f === 'all' || it.dataset.category === f;
        it.style.display = show ? '' : 'none';
      });
    });
  });

  // Lightbox
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxClose = $('.lightbox-close');
  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  }
  if (lightbox) {
    $$('.gallery-item img').forEach((img) => {
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Testimonial slider (auto-rotate)
  const slides = $$('#testimonialSlides .slide');
  const dotsWrap = $('#sliderDots');
  if (slides.length && dotsWrap) {
    let idx = 0;
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      b.addEventListener('click', () => { idx = i; render(); });
      dotsWrap.appendChild(b);
    });
    function render() {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      const dots = $$('#sliderDots button');
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
    function next() { idx = (idx + 1) % slides.length; render(); }
    render();
    setInterval(next, 5000);
  }

  // Current year
  const yearEl = $('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
/* ============================================
   GTACarsPH — LUXURY WEBSITE v2.0
   Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // SAMPLE INVENTORY DATA
  // ============================================
  window.carsInventory = [
    {
      id: 1,
      brand: 'Ford',
      model: 'EcoSport 1.5L Trend',
      year: 2015,
      price: 398000,
      mileage: 68000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'images/ecosport-1.jpg',
      badge: 'Best Seller',
      description: 'Ford EcoSport 2015, well-maintained, smooth city drive. Complete papers.'
    },
    {
      id: 2,
      brand: 'Ford',
      model: 'Focus 2.0L Titanium',
      year: 2016,
      price: 418000,
      mileage: 71000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'images/focus-1.jpg',
      badge: 'Featured',
      description: 'Ford Focus Titanium, DPS6 fully serviced. Feature-packed sedan.'
    },
    {
      id: 3,
      brand: 'Ford',
      model: 'Fiesta 1.5L Sport',
      year: 2015,
      price: 338000,
      mileage: 62000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'images/fiesta-1.jpg',
      badge: 'Best Value',
      description: 'Fun-to-drive Fiesta Sport, fuel-efficient, perfect first car.'
    },
    {
      id: 4,
      brand: 'Ford',
      model: 'Territory 1.5L Trend',
      year: 2021,
      price: 1050000,
      mileage: 18000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'images/territory-1.jpg',
      badge: 'Featured',
      description: 'Ford Territory 2021, low mileage, tech-loaded. Under warranty.'
    },
    {
      id: 5,
      brand: 'Ford',
      model: 'Everest 2.0L Titanium',
      year: 2020,
      price: 1680000,
      mileage: 32000,
      fuel: 'Diesel',
      transmission: 'Automatic',
      image: 'images/everest-1.jpg',
      badge: 'Premium',
      description: 'Ford Everest Titanium, 7-seater SUV, leather, panoramic roof.'
    },
    {
      id: 6,
      brand: 'Ford',
      model: 'EcoSport 1.5L Titanium',
      year: 2017,
      price: 458000,
      mileage: 54000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'images/ecosport-2.jpg',
      badge: 'Featured',
      description: 'Ford EcoSport Titanium, top variant. Heater hose upgrade done.'
    },
    {
      id: 7,
      brand: 'Ford',
      model: 'Ranger 2.0L Wildtrak',
      year: 2019,
      price: 1150000,
      mileage: 48000,
      fuel: 'Diesel',
      transmission: 'Automatic',
      image: 'images/ranger-1.jpg',
      badge: '',
      description: 'Ford Ranger Wildtrak, tough and reliable. Ready for work or play.'
    },
    {
      id: 8,
      brand: 'Ford',
      model: 'Territory 1.5L Titanium',
      year: 2022,
      price: 1180000,
      mileage: 12000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'images/territory-1.jpg',
      badge: 'Featured',
      description: 'Ford Territory Titanium, sunroof, 360 cam, premium leather.'
    }
  ];

  // ============================================
  // HERO SLIDESHOW
  // ============================================
  function initHeroSlideshow() {
    const slideshow = document.querySelector('.hero-slideshow');
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let current = 0;
    let interval;

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      current = index;
    }

    function nextSlide() {
      showSlide((current + 1) % slides.length);
    }

    function startSlideshow() {
      interval = setInterval(nextSlide, 6000);
    }

    function stopSlideshow() {
      clearInterval(interval);
    }

    if (dots.length) {
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          showSlide(parseInt(dot.dataset.index));
          stopSlideshow();
          startSlideshow();
        });
      });
    }

    startSlideshow();
  }

  // ============================================
  // HERO PARTICLES
  // ============================================
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (8 + Math.random() * 4) + 's';
      particle.style.width = (2 + Math.random() * 3) + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('navMenu');
    if (!toggle || !navMenu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // SCROLL ANIMATIONS (AOS-style)
  // ============================================
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // ============================================
  // BACK TO TOP
  // ============================================
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // INVENTORY RENDERER
  // ============================================
  function renderInventory(cars, containerId = 'inventoryGrid') {
    const container = document.getElementById(containerId);
    if (!container || !cars) return;

    if (!cars.length) {
      container.innerHTML = `
        <div class="inventory-empty">
          <i class="fas fa-car"></i>
          <h3>No Cars Found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = cars.map(car => `
      <div class="car-card animate-on-scroll">
        <div class="car-card-image">
          <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">
          ${car.badge ? `<span class="car-card-badge ${car.badge.toLowerCase()}">${car.badge}</span>` : ''}
        </div>
        <div class="car-card-body">
          <h3 class="car-card-title">${car.brand} ${car.model}</h3>
          <div class="car-card-price">₱${car.price.toLocaleString()}</div>
          <div class="car-card-specs">
            <span class="car-card-spec"><i class="fas fa-calendar"></i> ${car.year}</span>
            <span class="car-card-spec"><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} km</span>
            <span class="car-card-spec"><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
            <span class="car-card-spec"><i class="fas fa-cog"></i> ${car.transmission}</span>
          </div>
          <p style="font-size:0.8rem;color:var(--clr-text-muted);margin-bottom:1rem;">${car.description}</p>
          <div class="car-card-actions">
            <a href="https://facebook.com/GTACARSPH" target="_blank" class="btn btn-primary btn-sm"><i class="fab fa-facebook-messenger"></i> Inquire</a>
            <a href="tel:+639606303785" class="btn btn-secondary btn-sm"><i class="fas fa-phone"></i> Call</a>
          </div>
        </div>
      </div>
    `).join('');

    // Re-observe new animated elements
    initScrollAnimations();
  }

  // ============================================
  // INVENTORY FILTERS
  // ============================================
  function initInventoryFilters() {
    const filterForm = document.getElementById('filterForm');
    if (!filterForm) return;

    const allCars = window.carsInventory || [];

    function applyFilters() {
      const brand = document.getElementById('filterBrand')?.value || 'all';
      const minPrice = parseInt(document.getElementById('filterMinPrice')?.value) || 0;
      const maxPrice = parseInt(document.getElementById('filterMaxPrice')?.value) || Infinity;
      const minYear = parseInt(document.getElementById('filterYear')?.value) || 0;
      const fuel = document.getElementById('filterFuel')?.value || 'all';

      let filtered = allCars.filter(car => {
        if (brand !== 'all' && car.brand !== brand) return false;
        if (car.price < minPrice || car.price > maxPrice) return false;
        if (minYear && car.year < minYear) return false;
        if (fuel !== 'all' && car.fuel !== fuel) return false;
        return true;
      });

      renderInventory(filtered);
    }

    filterForm.querySelectorAll('select, input').forEach(el => {
      el.addEventListener('change', applyFilters);
    });

    // Initial render
    renderInventory(allCars);
  }

  // ============================================
  // GALLERY
  // ============================================
  function initGallery() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      const items = document.querySelectorAll('.gallery-item');
      if (items[index]) {
        const img = items[index].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(direction) {
      const items = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
      if (!items.length) return;
      let newIndex = currentIndex + direction;
      if (newIndex < 0) newIndex = items.length - 1;
      if (newIndex >= items.length) newIndex = 0;
      openLightbox(newIndex);
    }

    // Click on gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    // Click outside image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Gallery filters
    if (filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter || 'all';
          document.querySelectorAll('.gallery-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }
  }

  // ============================================
  // FINANCING CALCULATOR
  // ============================================
  function initCalculator() {
    const calcForm = document.getElementById('calcForm');
    if (!calcForm) return;

    function calculate() {
      const price = parseFloat(document.getElementById('calcPrice')?.value) || 0;
      const downPercent = parseFloat(document.getElementById('calcDown')?.value) || 20;
      const term = parseFloat(document.getElementById('calcTerm')?.value) || 60;
      const rate = 0.08; // 8% annual interest

      const downPayment = price * (downPercent / 100);
      const loanAmount = price - downPayment;
      const monthlyRate = rate / 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      const totalPayment = monthlyPayment * term;
      const totalInterest = totalPayment - loanAmount;

      document.getElementById('calcMonthly').textContent = '₱' + Math.round(monthlyPayment).toLocaleString();
      document.getElementById('calcDownResult').textContent = '₱' + Math.round(downPayment).toLocaleString();
      document.getElementById('calcLoanAmount').textContent = '₱' + Math.round(loanAmount).toLocaleString();
      document.getElementById('calcTotalInterest').textContent = '₱' + Math.round(totalInterest).toLocaleString();
      document.getElementById('calcTotalPayment').textContent = '₱' + Math.round(totalPayment).toLocaleString();
    }

    calcForm.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    });

    calculate();
  }

  // ============================================
  // CONTACT FORM (placeholder)
  // ============================================
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      // Simulate send — replace with EmailJS or formspree
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#22c55e';
        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  // ============================================
  // SELL CAR FORM (placeholder)
  // ============================================
  function initSellForm() {
    const form = document.getElementById('sellForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Submitted! We\'ll contact you!';
        btn.style.background = '#22c55e';
        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  // ============================================
  // TESTIMONIALS DATA
  // ============================================
  function renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;

    const testimonials = [
      { name: 'Juan dela Cruz', role: 'Happy Customer', text: 'Bought a Honda Civic from GTACarsPH. Smooth transaction, no hidden issues. Highly recommend!', rating: 5 },
      { name: 'Maria Santos', role: 'Return Customer', text: 'Second car ko na to sa kanila. Trustworthy at napaka-professional. Ford repair nila world-class!', rating: 5 },
      { name: 'Carlos Mendoza', role: 'First-time Buyer', text: 'First time buying a used car, and GTACarsPH made it so easy. Got approved for financing in 2 days!', rating: 5 },
      { name: 'Ana Reyes', role: 'Car Seller', text: 'Binenta ko sasakyan ko sa kanila. Fair price, cash agad. Walang sakit ng ulo!', rating: 5 },
      { name: 'Dennis Tan', role: 'Ford Owner', text: 'Ford Focus ko pinaayos nila. ABS module repair — 3 days lang okay na! Sila lang nagawa nyan.', rating: 5 }
    ];

    container.innerHTML = testimonials.map(t => `
      <div class="testimonial-card animate-on-scroll">
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.name.charAt(0)}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-role">${t.role}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ============================================
  // ACTIVE PAGE HIGHLIGHT
  // ============================================
  function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === 'index.html' && (href === '#' || href === 'index.html' || href === ''))) {
        link.classList.add('active');
      }
    });
  }

  // ============================================
  // CAROUSEL (for featured cars on mobile)
  // ============================================
  function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ============================================
  // INIT ALL
  // ============================================
  initNavbar();
  initMobileMenu();
  initHeroSlideshow();
  initParticles();
  initScrollAnimations();
  initBackToTop();
  initInventoryFilters();
  initGallery();
  initCalculator();
  initContactForm();
  initSellForm();
  renderTestimonials();
  highlightActivePage();
  initCarousel();
  initSmoothScroll();

});
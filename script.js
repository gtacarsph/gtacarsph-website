1|/* ============================================
2|   GTACarsPH — LUXURY WEBSITE v2.0
3|   Interactive Features
4|   ============================================ */
5|
6|document.addEventListener('DOMContentLoaded', () => {
7|
8|  // ============================================
9|  // SAMPLE INVENTORY DATA
10|  // ============================================
11|  window.carsInventory = [
    {
      id: 1,
      brand: 'Ford',
      model: 'EcoSport Titanium 1.5L',
      year: 2022,
      price: 698000,
      mileage: 18000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1606664514181-ff2586c6a58f?w=600&q=80',
      badge: 'Featured',
      description: 'Compact SUV, perfect for city driving. Low mileage, well-maintained, one owner.'
    },
    {
      id: 2,
      brand: 'Ford',
      model: 'Fiesta Sport 1.5L',
      year: 2020,
      price: 398000,
      mileage: 45000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
      badge: 'Best Value',
      description: 'Fun-to-drive hatchback, fuel-efficient, perfect first car. Freshly detailed!'
    },
    {
      id: 3,
      brand: 'Ford',
      model: 'Territory Titanium X 1.5L',
      year: 2023,
      price: 1280000,
      mileage: 12000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1617469767053-d3b7fb1e8b32?w=600&q=80',
      badge: 'Featured',
      description: 'Brand new look Territory! Loaded with tech — sunroof, 360 cam, premium leather.'
    },
    {
      id: 4,
      brand: 'Ford',
      model: 'Ranger Wildtrak 2.0L Bi-Turbo',
      year: 2021,
      price: 1450000,
      mileage: 30000,
      fuel: 'Diesel',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
      badge: 'Sold',
      description: 'Top-of-the-line Wildtrak, loaded with accessories. Ready for any adventure.'
    },
    {
      id: 5,
      brand: 'Ford',
      model: 'Everest Titanium 2.0L 4x4',
      year: 2022,
      price: 1850000,
      mileage: 22000,
      fuel: 'Diesel',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80',
      badge: 'Featured',
      description: 'Premier 7-seater SUV. Leather seats, panoramic roof, Terrain Management.'
    },
    {
      id: 6,
      brand: 'Ford',
      model: 'Focus Titanium 2.0L',
      year: 2019,
      price: 498000,
      mileage: 55000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
      badge: '',
      description: 'Well-kept Focus Titanium, DPS6 already serviced. Runs like new!'
    },
    {
      id: 7,
      brand: 'Ford',
      model: 'EcoSport Trend 1.5L',
      year: 2021,
      price: 598000,
      mileage: 25000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1606664514181-ff2586c6a58f?w=600&q=80',
      badge: 'Featured',
      description: 'Affordable EcoSport Trend. Heater hose upgrade done. One owner, all papers complete.'
    },
    {
      id: 8,
      brand: 'Ford',
      model: 'Territory Trend 1.5L',
      year: 2022,
      price: 1080000,
      mileage: 16000,
      fuel: 'Gasoline',
      transmission: 'Automatic',
      image: 'https://images.unsplash.com/photo-1617469767053-d3b7fb1e8b32?w=600&q=80',
      badge: '',
      description: 'Sleek Territory Trend. Low mileage, Ford PMS done, still under warranty.'
    }
  ];
117|
118|  // ============================================
119|  // HERO SLIDESHOW
120|  // ============================================
121|  function initHeroSlideshow() {
122|    const slideshow = document.querySelector('.hero-slideshow');
123|    if (!slideshow) return;
124|
125|    const slides = slideshow.querySelectorAll('.hero-slide');
126|    const dots = document.querySelectorAll('.hero-dot');
127|    let current = 0;
128|    let interval;
129|
130|    function showSlide(index) {
131|      slides.forEach(s => s.classList.remove('active'));
132|      dots.forEach(d => d.classList.remove('active'));
133|      slides[index].classList.add('active');
134|      dots[index].classList.add('active');
135|      current = index;
136|    }
137|
138|    function nextSlide() {
139|      showSlide((current + 1) % slides.length);
140|    }
141|
142|    function startSlideshow() {
143|      interval = setInterval(nextSlide, 6000);
144|    }
145|
146|    function stopSlideshow() {
147|      clearInterval(interval);
148|    }
149|
150|    if (dots.length) {
151|      dots.forEach(dot => {
152|        dot.addEventListener('click', () => {
153|          showSlide(parseInt(dot.dataset.index));
154|          stopSlideshow();
155|          startSlideshow();
156|        });
157|      });
158|    }
159|
160|    startSlideshow();
161|  }
162|
163|  // ============================================
164|  // HERO PARTICLES
165|  // ============================================
166|  function initParticles() {
167|    const container = document.querySelector('.hero-particles');
168|    if (!container) return;
169|
170|    for (let i = 0; i < 30; i++) {
171|      const particle = document.createElement('div');
172|      particle.className = 'particle';
173|      particle.style.left = Math.random() * 100 + '%';
174|      particle.style.animationDelay = Math.random() * 8 + 's';
175|      particle.style.animationDuration = (8 + Math.random() * 4) + 's';
176|      particle.style.width = (2 + Math.random() * 3) + 'px';
177|      particle.style.height = particle.style.width;
178|      container.appendChild(particle);
179|    }
180|  }
181|
182|  // ============================================
183|  // NAVBAR SCROLL EFFECT
184|  // ============================================
185|  function initNavbar() {
186|    const navbar = document.getElementById('navbar');
187|    if (!navbar) return;
188|
189|    window.addEventListener('scroll', () => {
190|      if (window.scrollY > 80) {
191|        navbar.classList.add('scrolled');
192|      } else {
193|        navbar.classList.remove('scrolled');
194|      }
195|    });
196|  }
197|
198|  // ============================================
199|  // MOBILE MENU
200|  // ============================================
201|  function initMobileMenu() {
202|    const toggle = document.querySelector('.menu-toggle');
203|    const navMenu = document.getElementById('navMenu');
204|    if (!toggle || !navMenu) return;
205|
206|    toggle.addEventListener('click', () => {
207|      toggle.classList.toggle('active');
208|      navMenu.classList.toggle('open');
209|      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
210|    });
211|
212|    // Close menu on link click
213|    navMenu.querySelectorAll('a').forEach(link => {
214|      link.addEventListener('click', () => {
215|        toggle.classList.remove('active');
216|        navMenu.classList.remove('open');
217|        document.body.style.overflow = '';
218|      });
219|    });
220|  }
221|
222|  // ============================================
223|  // SCROLL ANIMATIONS (AOS-style)
224|  // ============================================
225|  function initScrollAnimations() {
226|    const elements = document.querySelectorAll('.animate-on-scroll');
227|
228|    const observer = new IntersectionObserver((entries) => {
229|      entries.forEach(entry => {
230|        if (entry.isIntersecting) {
231|          entry.target.classList.add('visible');
232|          observer.unobserve(entry.target);
233|        }
234|      });
235|    }, {
236|      threshold: 0.1,
237|      rootMargin: '0px 0px -50px 0px'
238|    });
239|
240|    elements.forEach(el => observer.observe(el));
241|  }
242|
243|  // ============================================
244|  // BACK TO TOP
245|  // ============================================
246|  function initBackToTop() {
247|    const btn = document.querySelector('.back-to-top');
248|    if (!btn) return;
249|
250|    window.addEventListener('scroll', () => {
251|      if (window.scrollY > 500) {
252|        btn.classList.add('visible');
253|      } else {
254|        btn.classList.remove('visible');
255|      }
256|    });
257|
258|    btn.addEventListener('click', () => {
259|      window.scrollTo({ top: 0, behavior: 'smooth' });
260|    });
261|  }
262|
263|  // ============================================
264|  // INVENTORY RENDERER
265|  // ============================================
266|  function renderInventory(cars, containerId = 'inventoryGrid') {
267|    const container = document.getElementById(containerId);
268|    if (!container || !cars) return;
269|
270|    if (!cars.length) {
271|      container.innerHTML = `
272|        <div class="inventory-empty">
273|          <i class="fas fa-car"></i>
274|          <h3>No Cars Found</h3>
275|          <p>Try adjusting your filters to see more results.</p>
276|        </div>
277|      `;
278|      return;
279|    }
280|
281|    container.innerHTML = cars.map(car => `
282|      <div class="car-card animate-on-scroll">
283|        <div class="car-card-image">
284|          <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">
285|          ${car.badge ? `<span class="car-card-badge ${car.badge.toLowerCase()}">${car.badge}</span>` : ''}
286|        </div>
287|        <div class="car-card-body">
288|          <h3 class="car-card-title">${car.brand} ${car.model}</h3>
289|          <div class="car-card-price">₱${car.price.toLocaleString()}</div>
290|          <div class="car-card-specs">
291|            <span class="car-card-spec"><i class="fas fa-calendar"></i> ${car.year}</span>
292|            <span class="car-card-spec"><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} km</span>
293|            <span class="car-card-spec"><i class="fas fa-gas-pump"></i> ${car.fuel}</span>
294|            <span class="car-card-spec"><i class="fas fa-cog"></i> ${car.transmission}</span>
295|          </div>
296|          <p style="font-size:0.8rem;color:var(--clr-text-muted);margin-bottom:1rem;">${car.description}</p>
297|          <div class="car-card-actions">
298|            <a href="https://facebook.com/GTACARSPH" target="_blank" class="btn btn-primary btn-sm"><i class="fab fa-facebook-messenger"></i> Inquire</a>
299|            <a href="tel:+639****3785" class="btn btn-secondary btn-sm"><i class="fas fa-phone"></i> Call</a>
300|          </div>
301|        </div>
302|      </div>
303|    `).join('');
304|
305|    // Re-observe new animated elements
306|    initScrollAnimations();
307|  }
308|
309|  // ============================================
310|  // INVENTORY FILTERS
311|  // ============================================
312|  function initInventoryFilters() {
313|    const filterForm = document.getElementById('filterForm');
314|    if (!filterForm) return;
315|
316|    const allCars = window.carsInventory || [];
317|
318|    function applyFilters() {
319|      const brand = document.getElementById('filterBrand')?.value || 'all';
320|      const minPrice = parseInt(document.getElementById('filterMinPrice')?.value) || 0;
321|      const maxPrice = parseInt(document.getElementById('filterMaxPrice')?.value) || Infinity;
322|      const minYear = parseInt(document.getElementById('filterYear')?.value) || 0;
323|      const fuel = document.getElementById('filterFuel')?.value || 'all';
324|
325|      let filtered = allCars.filter(car => {
326|        if (brand !== 'all' && car.brand !== brand) return false;
327|        if (car.price < minPrice || car.price > maxPrice) return false;
328|        if (minYear && car.year < minYear) return false;
329|        if (fuel !== 'all' && car.fuel !== fuel) return false;
330|        return true;
331|      });
332|
333|      renderInventory(filtered);
334|    }
335|
336|    filterForm.querySelectorAll('select, input').forEach(el => {
337|      el.addEventListener('change', applyFilters);
338|    });
339|
340|    // Initial render
341|    renderInventory(allCars);
342|  }
343|
344|  // ============================================
345|  // GALLERY
346|  // ============================================
347|  function initGallery() {
348|    const lightbox = document.getElementById('lightbox');
349|    if (!lightbox) return;
350|
351|    const lightboxImg = lightbox.querySelector('img');
352|    const closeBtn = lightbox.querySelector('.lightbox-close');
353|    const prevBtn = lightbox.querySelector('.lightbox-prev');
354|    const nextBtn = lightbox.querySelector('.lightbox-next');
355|    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
356|    let currentIndex = 0;
357|
358|    function openLightbox(index) {
359|      currentIndex = index;
360|      const items = document.querySelectorAll('.gallery-item');
361|      if (items[index]) {
362|        const img = items[index].querySelector('img');
363|        lightboxImg.src = img.src;
364|        lightboxImg.alt = img.alt;
365|        lightbox.classList.add('active');
366|        document.body.style.overflow = 'hidden';
367|      }
368|    }
369|
370|    function closeLightbox() {
371|      lightbox.classList.remove('active');
372|      document.body.style.overflow = '';
373|    }
374|
375|    function navigate(direction) {
376|      const items = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
377|      if (!items.length) return;
378|      let newIndex = currentIndex + direction;
379|      if (newIndex < 0) newIndex = items.length - 1;
380|      if (newIndex >= items.length) newIndex = 0;
381|      openLightbox(newIndex);
382|    }
383|
384|    // Click on gallery items
385|    document.querySelectorAll('.gallery-item').forEach((item, index) => {
386|      item.addEventListener('click', () => openLightbox(index));
387|    });
388|
389|    closeBtn.addEventListener('click', closeLightbox);
390|    prevBtn.addEventListener('click', () => navigate(-1));
391|    nextBtn.addEventListener('click', () => navigate(1));
392|
393|    // Keyboard navigation
394|    document.addEventListener('keydown', (e) => {
395|      if (!lightbox.classList.contains('active')) return;
396|      if (e.key === 'Escape') closeLightbox();
397|      if (e.key === 'ArrowLeft') navigate(-1);
398|      if (e.key === 'ArrowRight') navigate(1);
399|    });
400|
401|    // Click outside image
402|    lightbox.addEventListener('click', (e) => {
403|      if (e.target === lightbox) closeLightbox();
404|    });
405|
406|    // Gallery filters
407|    if (filterBtns.length) {
408|      filterBtns.forEach(btn => {
409|        btn.addEventListener('click', () => {
410|          filterBtns.forEach(b => b.classList.remove('active'));
411|          btn.classList.add('active');
412|          const filter = btn.dataset.filter || 'all';
413|          document.querySelectorAll('.gallery-item').forEach(item => {
414|            if (filter === 'all' || item.dataset.category === filter) {
415|              item.style.display = '';
416|            } else {
417|              item.style.display = 'none';
418|            }
419|          });
420|        });
421|      });
422|    }
423|  }
424|
425|  // ============================================
426|  // FINANCING CALCULATOR
427|  // ============================================
428|  function initCalculator() {
429|    const calcForm = document.getElementById('calcForm');
430|    if (!calcForm) return;
431|
432|    function calculate() {
433|      const price = parseFloat(document.getElementById('calcPrice')?.value) || 0;
434|      const downPercent = parseFloat(document.getElementById('calcDown')?.value) || 20;
435|      const term = parseFloat(document.getElementById('calcTerm')?.value) || 60;
436|      const rate = 0.08; // 8% annual interest
437|
438|      const downPayment = price * (downPercent / 100);
439|      const loanAmount = price - downPayment;
440|      const monthlyRate = rate / 12;
441|      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
442|      const totalPayment = monthlyPayment * term;
443|      const totalInterest = totalPayment - loanAmount;
444|
445|      document.getElementById('calcMonthly').textContent = '₱' + Math.round(monthlyPayment).toLocaleString();
446|      document.getElementById('calcDownResult').textContent = '₱' + Math.round(downPayment).toLocaleString();
447|      document.getElementById('calcLoanAmount').textContent = '₱' + Math.round(loanAmount).toLocaleString();
448|      document.getElementById('calcTotalInterest').textContent = '₱' + Math.round(totalInterest).toLocaleString();
449|      document.getElementById('calcTotalPayment').textContent = '₱' + Math.round(totalPayment).toLocaleString();
450|    }
451|
452|    calcForm.querySelectorAll('input, select').forEach(el => {
453|      el.addEventListener('input', calculate);
454|      el.addEventListener('change', calculate);
455|    });
456|
457|    calculate();
458|  }
459|
460|  // ============================================
461|  // CONTACT FORM (placeholder)
462|  // ============================================
463|  function initContactForm() {
464|    const form = document.getElementById('contactForm');
465|    if (!form) return;
466|
467|    form.addEventListener('submit', (e) => {
468|      e.preventDefault();
469|
470|      const btn = form.querySelector('button[type="submit"]');
471|      const originalText = btn.innerHTML;
472|      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
473|      btn.disabled = true;
474|
475|      // Simulate send — replace with EmailJS or formspree
476|      setTimeout(() => {
477|        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
478|        btn.style.background = '#22c55e';
479|        form.reset();
480|
481|        setTimeout(() => {
482|          btn.innerHTML = originalText;
483|          btn.disabled = false;
484|          btn.style.background = '';
485|        }, 3000);
486|      }, 1500);
487|    });
488|  }
489|
490|  // ============================================
491|  // SELL CAR FORM (placeholder)
492|  // ============================================
493|  function initSellForm() {
494|    const form = document.getElementById('sellForm');
495|    if (!form) return;
496|
497|    form.addEventListener('submit', (e) => {
498|      e.preventDefault();
499|
500|      const btn = form.querySelector('button[type="submit"]');
501|
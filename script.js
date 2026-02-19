/**
 * GTACarsPH Website - Main JavaScript
 * Professional Automotive Dealership Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initSellCarForm();
    initSmoothScroll();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav').offsetHeight || 70;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Effects - Active Link & Reveal
 */
function initScrollEffects() {
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.car-card, .serv-card, .info-card, .stat-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
}

/**
 * Sell Your Car Form Handling
 */
function initSellCarForm() {
    const form = document.getElementById('sellCarForm');
    const fileInput = document.getElementById('carPhotos');
    const filePreview = document.getElementById('filePreview');
    
    if (!form) return;
    
    // File upload preview
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', function(e) {
            filePreview.innerHTML = '';
            const files = Array.from(e.target.files).slice(0, 5); // Max 5 files
            
            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const div = document.createElement('div');
                        div.className = 'file-preview-item';
                        div.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-file" data-index="${index}">&times;</button>
                        `;
                        filePreview.appendChild(div);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        // Remove file handler
        filePreview.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-file')) {
                e.target.parentElement.remove();
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        const requiredFields = ['carBrand', 'carYear', 'mileage', 'condition', 'expectedPrice', 'ownerName', 'contactNumber', 'location'];
        let isValid = true;
        let missingFields = [];
        
        requiredFields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!data[field] || data[field].trim() === '') {
                isValid = false;
                missingFields.push(field);
                if (input) {
                    input.style.borderColor = '#EF4444';
                    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            } else {
                if (input) {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                }
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Format message for Facebook Messenger and Email
        const message = `🚗 CAR SELLING INQUIRY

📋 CAR DETAILS:
• Brand/Model: ${data.carBrand}
• Year: ${data.carYear}
• Mileage: ${data.mileage} km
• Condition: ${data.condition}
• Expected Price: ₱${parseInt(data.expectedPrice).toLocaleString()}

👤 SELLER INFO:
• Name: ${data.ownerName}
• Contact: ${data.contactNumber}
• Location: ${data.location}

📝 Notes: ${data.notes || 'None'}

---
Sent from GTACarsPH Website`;
        
        // Open Facebook Messenger
        const fbUrl = `https://m.me/GTACARSPH?ref=${encodeURIComponent(message.substring(0, 200))}`;
        window.open(fbUrl, '_blank');
        
        // Prepare email
        const emailSubject = `Car Selling Inquiry - ${data.carBrand} (${data.carYear})`;
        const emailBody = encodeURIComponent(message);
        const mailtoLink = `mailto:gtacarsph@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;
        
        // Open email in new tab (delayed)
        setTimeout(() => {
            window.open(mailtoLink, '_blank');
        }, 1000);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        form.reset();
        if (filePreview) filePreview.innerHTML = '';
    });
    
    // Clear error styling on input
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Show Success Modal
 */
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            modal.classList.remove('active');
        }, 5000);
    }
}

/**
 * Close Modal Function
 */
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 500;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#2563EB'};
        color: white;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 4000);
}

/**
 * Lazy Loading for Images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Counter Animation for Stats
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .about-stats').forEach(section => {
    counterObserver.observe(section);
});

console.log('🚗 GTACarsPH Website Loaded Successfully!');

/* ============================================
   PREMIUM.JS - Apple/SaaS Style Interactions
   Magnetic buttons, 3D tilt, scroll progress, etc.
   Pure JavaScript - No external libraries
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  
  const config = {
    isTouchDevice: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isMobile: window.innerWidth <= 968,
    magneticStrength: 0.3, // How much buttons follow cursor (0-1)
    tiltStrength: 15, // Max tilt angle in degrees
    scrollProgressThreshold: 100, // Pixels to scroll before showing progress bar
  };

  // ============================================
  // 1) MAGNETIC BUTTON HOVER EFFECT
  // ============================================
  
  class MagneticButton {
    constructor(element) {
      this.element = element;
      this.rect = null;
      this.boundMouseMove = this.onMouseMove.bind(this);
      this.boundMouseLeave = this.onMouseLeave.bind(this);
      
      if (!config.isTouchDevice && !config.prefersReducedMotion && !config.isMobile) {
        this.init();
      }
    }
    
    init() {
      this.element.classList.add('btn-magnetic');
      this.element.addEventListener('mouseenter', () => {
        this.rect = this.element.getBoundingClientRect();
        this.element.addEventListener('mousemove', this.boundMouseMove);
      });
      
      this.element.addEventListener('mouseleave', this.boundMouseLeave);
    }
    
    onMouseMove(e) {
      if (!this.rect) return;
      
      const x = e.clientX - this.rect.left;
      const y = e.clientY - this.rect.top;
      
      const centerX = this.rect.width / 2;
      const centerY = this.rect.height / 2;
      
      const deltaX = (x - centerX) * config.magneticStrength;
      const deltaY = (y - centerY) * config.magneticStrength;
      
      // Update mouse position for gradient effect
      const mouseXPercent = (x / this.rect.width) * 100;
      const mouseYPercent = (y / this.rect.height) * 100;
      
      this.element.style.setProperty('--mouse-x', `${mouseXPercent}%`);
      this.element.style.setProperty('--mouse-y', `${mouseYPercent}%`);
      
      requestAnimationFrame(() => {
        this.element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    }
    
    onMouseLeave() {
      this.element.removeEventListener('mousemove', this.boundMouseMove);
      requestAnimationFrame(() => {
        this.element.style.transform = '';
      });
    }
  }
  
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .whatsapp-btn, .btn-accent, .btn-primary, .btn-secondary');
    buttons.forEach(btn => new MagneticButton(btn));
  }

  // ============================================
  // 2) 3D TILT + GLASS HIGHLIGHT EFFECT
  // ============================================
  
  class TiltCard {
    constructor(element) {
      this.element = element;
      this.rect = null;
      this.highlight = null;
      this.boundMouseMove = this.onMouseMove.bind(this);
      this.boundMouseLeave = this.onMouseLeave.bind(this);
      
      // DISABLED - No tilt effect
      /*
      if (!config.isTouchDevice && !config.prefersReducedMotion && !config.isMobile) {
        this.init();
      }
      */
    }
    
    init() {
      this.element.classList.add('card-tilt');
      
      // Create glass highlight element
      this.highlight = document.createElement('div');
      this.highlight.className = 'glass-highlight';
      this.element.appendChild(this.highlight);
      
      // Wrap existing content
      const content = Array.from(this.element.children).filter(el => 
        !el.classList.contains('glass-highlight')
      );
      
      this.element.addEventListener('mouseenter', () => {
        this.rect = this.element.getBoundingClientRect();
        this.element.addEventListener('mousemove', this.boundMouseMove);
      });
      
      this.element.addEventListener('mouseleave', this.boundMouseLeave);
    }
    
    onMouseMove(e) {
      if (!this.rect) return;
      
      const x = e.clientX - this.rect.left;
      const y = e.clientY - this.rect.top;
      
      const centerX = this.rect.width / 2;
      const centerY = this.rect.height / 2;
      
      // Calculate rotation
      const rotateX = ((y - centerY) / centerY) * config.tiltStrength * -1;
      const rotateY = ((x - centerX) / centerX) * config.tiltStrength;
      
      // Update highlight position
      if (this.highlight) {
        requestAnimationFrame(() => {
          this.highlight.style.left = `${x - 100}px`;
          this.highlight.style.top = `${y - 100}px`;
        });
      }
      
      requestAnimationFrame(() => {
        this.element.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          scale3d(1.02, 1.02, 1.02)
        `;
      });
    }
    
    onMouseLeave() {
      this.element.removeEventListener('mousemove', this.boundMouseMove);
      requestAnimationFrame(() => {
        this.element.style.transform = '';
      });
    }
  }
  
  function initTiltCards() {
    const cards = document.querySelectorAll('.product-card, .feedback-card, .card-premium, .glass-card');
    cards.forEach(card => new TiltCard(card));
  }

  // ============================================
  // 3) SCROLL PROGRESS BAR
  // ============================================
  
  class ScrollProgress {
    constructor() {
      this.container = null;
      this.bar = null;
      this.visible = false;
      this.ticking = false;
      this.init();
    }
    
    init() {
      // Create progress bar elements
      this.container = document.createElement('div');
      this.container.className = 'scroll-progress';
      
      this.bar = document.createElement('div');
      this.bar.className = 'scroll-progress-bar';
      
      this.container.appendChild(this.bar);
      document.body.appendChild(this.container);
      
      // Listen to scroll
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      window.addEventListener('resize', () => this.onScroll(), { passive: true });
      
      this.onScroll();
    }
    
    onScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }
    
    update() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      // Show/hide based on scroll position
      if (scrollTop > config.scrollProgressThreshold && !this.visible) {
        this.container.classList.add('visible');
        this.visible = true;
      } else if (scrollTop <= config.scrollProgressThreshold && this.visible) {
        this.container.classList.remove('visible');
        this.visible = false;
      }
      
      // Update width
      this.bar.style.width = `${Math.min(progress, 100)}%`;
    }
  }

  // ============================================
  // 4) BACK TO TOP BUTTON
  // ============================================
  
  class BackToTop {
    constructor() {
      this.button = null;
      this.visible = false;
      this.ticking = false;
      this.threshold = 300; // Pixels to scroll before showing button
      this.init();
    }
    
    init() {
      // Create button
      this.button = document.createElement('button');
      this.button.className = 'back-to-top';
      this.button.innerHTML = '↑';
      this.button.setAttribute('aria-label', 'Back to top');
      this.button.setAttribute('title', 'Back to top');
      
      // Click handler
      this.button.addEventListener('click', () => this.scrollToTop());
      
      // Keyboard support
      this.button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.scrollToTop();
        }
      });
      
      document.body.appendChild(this.button);
      
      // Listen to scroll
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      
      this.onScroll();
    }
    
    onScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }
    
    update() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > this.threshold && !this.visible) {
        this.button.classList.add('visible');
        this.visible = true;
      } else if (scrollTop <= this.threshold && this.visible) {
        this.button.classList.remove('visible');
        this.visible = false;
      }
    }
    
    scrollToTop() {
      if (config.prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  }

  // ============================================
  // 5) PREMIUM TOAST NOTIFICATION SYSTEM
  // ============================================
  
  class ToastSystem {
    constructor() {
      this.container = null;
      this.toasts = [];
      this.init();
    }
    
    init() {
      // Create container if it doesn't exist
      this.container = document.getElementById('toast-container');
      
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
    
    show(options = {}) {
      const {
        title = '',
        message = '',
        type = 'info', // success, error, warning, info
        duration = 4000,
        icon = this.getDefaultIcon(type)
      } = options;
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      
      toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
          ${title ? `<div class="toast-title">${this.escapeHtml(title)}</div>` : ''}
          ${message ? `<div class="toast-message">${this.escapeHtml(message)}</div>` : ''}
        </div>
        <button class="toast-close" aria-label="Close notification">×</button>
      `;
      
      // Close button handler
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.remove(toast));
      
      this.container.appendChild(toast);
      this.toasts.push(toast);
      
      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => this.remove(toast), duration);
      }
      
      return toast;
    }
    
    remove(toast) {
      if (!toast || !toast.parentNode) return;
      
      toast.classList.add('removing');
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }
    
    getDefaultIcon(type) {
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };
      return icons[type] || icons.info;
    }
    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Convenience methods
    success(message, title = 'Success') {
      return this.show({ title, message, type: 'success' });
    }
    
    error(message, title = 'Error') {
      return this.show({ title, message, type: 'error' });
    }
    
    warning(message, title = 'Warning') {
      return this.show({ title, message, type: 'warning' });
    }
    
    info(message, title = 'Info') {
      return this.show({ title, message, type: 'info' });
    }
  }

  // ============================================
  // 6) ICON MICRO-ANIMATIONS
  // ============================================
  
  function initIconAnimations() {
    const icons = document.querySelectorAll('.card-icon, .product-image, .social-link');
    
    icons.forEach(icon => {
      icon.classList.add('icon-hover');
    });
  }

  // ============================================
  // 7) SPOTLIGHT BACKGROUND EFFECT
  // ============================================
  
  function initSpotlightEffect() {
    if (config.isMobile || config.prefersReducedMotion) return;
    
    const spotlightSections = document.querySelectorAll('.spotlight-bg');
    let ticking = false;
    
    const updateSpotlight = () => {
      spotlightSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const translateY = scrollPercent * 100 - 50;
        
        const spotlight = section.querySelector('::before');
        if (section.style) {
          section.style.setProperty('--spotlight-y', `${translateY}px`);
        }
      });
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateSpotlight);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // 8) ENHANCED SCROLL REVEAL
  // ============================================
  
  function enhanceScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animating');
          
          // Remove will-change after animation
          setTimeout(() => {
            entry.target.classList.remove('animating');
            entry.target.classList.add('animation-complete');
          }, 600);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // 9) PERFORMANCE MONITOR
  // ============================================
  
  class PerformanceMonitor {
    constructor() {
      this.frameCount = 0;
      this.fps = 60;
      this.lastTime = performance.now();
      
      if (window.location.search.includes('debug')) {
        this.init();
      }
    }
    
    init() {
      this.measure();
    }
    
    measure() {
      const currentTime = performance.now();
      this.frameCount++;
      
      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Adjust config if FPS is low
        if (this.fps < 30 && !config.isMobile) {
          console.warn('Low FPS detected. Consider disabling heavy effects.');
        }
      }
      
      requestAnimationFrame(() => this.measure());
    }
  }

  // ============================================
  // 10) INITIALIZE ALL PREMIUM FEATURES
  // ============================================
  
  let scrollProgress = null;
  let backToTop = null;
  let toastSystem = null;
  let performanceMonitor = null;
  
  function initPremiumFeatures() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPremiumFeatures);
      return;
    }
    
    // Initialize magnetic buttons
    setTimeout(() => initMagneticButtons(), 100);
    
    // Initialize tilt cards
    setTimeout(() => initTiltCards(), 200);
    
    // Initialize scroll progress bar
    scrollProgress = new ScrollProgress();
    
    // Initialize back to top button
    backToTop = new BackToTop();
    
    // Initialize toast system
    toastSystem = new ToastSystem();
    
    // Initialize icon animations
    initIconAnimations();
    
    // Initialize spotlight effect
    initSpotlightEffect();
    
    // Enhance scroll reveal
    enhanceScrollReveal();
    
    // Performance monitoring (debug mode only)
    performanceMonitor = new PerformanceMonitor();
    
    // Re-initialize on dynamic content changes
    const observer = new MutationObserver((mutations) => {
      let shouldReinit = false;
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.classList && (
                node.classList.contains('btn') ||
                node.classList.contains('product-card') ||
                node.classList.contains('feedback-card')
              )) {
                shouldReinit = true;
              }
            }
          });
        }
      });
      
      if (shouldReinit) {
        setTimeout(() => {
          initMagneticButtons();
          initTiltCards();
        }, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ============================================
  // 11) GLOBAL API (Expose to window)
  // ============================================
  
  window.PremiumToast = {
    show: (options) => toastSystem?.show(options),
    success: (message, title) => toastSystem?.success(message, title),
    error: (message, title) => toastSystem?.error(message, title),
    warning: (message, title) => toastSystem?.warning(message, title),
    info: (message, title) => toastSystem?.info(message, title),
  };
  
  // Override the existing showToast function if it exists
  window.showToast = function(message, type = 'success') {
    const typeMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    
    toastSystem?.show({
      message: message,
      type: typeMap[type] || 'info',
      duration: 3000
    });
  };
  
  // Utility to reinitialize premium effects
  window.reinitPremiumEffects = function() {
    initMagneticButtons();
    initTiltCards();
    initIconAnimations();
  };
  
  // ============================================
  // AUTO-INITIALIZE
  // ============================================
  
  initPremiumFeatures();
  
  console.log('✨ Premium effects loaded - Apple-style interactions active!');
  
})();

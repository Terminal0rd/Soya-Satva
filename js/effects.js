/* ============================================
   EFFECTS.JS - Premium Cursor Glow & Parallax Engine
   No external libraries - Pure JavaScript
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // 1) CURSOR GLOW EFFECT
  // ============================================
  
  let cursorGlow = null;
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  const ease = 0.15; // Smooth following effect
  
  function initCursorGlow() {
    // Check if device supports hover (not touch device)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouchDevice || prefersReducedMotion) {
      return; // Don't initialize on touch devices or if reduced motion preferred
    }
    
    // Create cursor glow element
    cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Show cursor glow when mouse moves
      if (cursorGlow.style.opacity === '0' || cursorGlow.style.opacity === '') {
        cursorGlow.style.opacity = '1';
      }
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (cursorGlow) {
        cursorGlow.style.opacity = '0';
      }
    });
    
    // Smooth cursor follow animation
    function animateCursor() {
      // Lerp (linear interpolation) for smooth following
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      
      if (cursorGlow) {
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
      }
      
      requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
  }
  
  // ============================================
  // 2) PARALLAX SCROLL EFFECT
  // ============================================
  
  let parallaxElements = [];
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function initParallax() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check if mobile device (disable parallax on mobile for performance)
    const isMobile = window.innerWidth <= 968;
    
    if (prefersReducedMotion || isMobile) {
      return; // Don't initialize parallax
    }
    
    // Find all parallax elements
    parallaxElements = Array.from(document.querySelectorAll('.parallax-layer'));
    
    if (parallaxElements.length === 0) {
      return; // No parallax elements found
    }
    
    // Initial parallax update
    updateParallax();
    
    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  }
  
  function onScroll() {
    lastScrollY = window.scrollY;
    requestTick();
  }
  
  function onResize() {
    // Re-initialize parallax on resize
    const isMobile = window.innerWidth <= 968;
    if (isMobile) {
      // Reset all transforms on mobile
      parallaxElements.forEach(el => {
        el.style.transform = 'none';
      });
    } else {
      updateParallax();
    }
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  function updateParallax() {
    ticking = false;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
      const rect = element.getBoundingClientRect();
      const elementMiddle = rect.top + rect.height / 2;
      const windowMiddle = window.innerHeight / 2;
      
      // Calculate offset based on element position relative to viewport center
      const offset = (elementMiddle - windowMiddle) * speed;
      
      // Apply transform with GPU acceleration
      element.style.transform = `translate3d(0, ${-offset}px, 0)`;
    });
  }
  
  // ============================================
  // 3) PAGE TRANSITION EFFECT
  // ============================================
  
  function initPageTransition() {
    // Add loaded class to body for fade-in effect
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // Add page-transition class to main content
    const mainContent = document.querySelector('main') || document.body;
    if (mainContent && !mainContent.classList.contains('page-transition')) {
      mainContent.classList.add('page-transition');
    }
  }
  
  // ============================================
  // 4) ENHANCED HOVER EFFECTS
  // ============================================
  
  function init3DHoverEffect() {
    const cards = document.querySelectorAll('.card-premium');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateY(-8px) 
          scale(1.02)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  
  // ============================================
  // 5) FLOATING SHAPES PARALLAX
  // ============================================
  
  function initFloatingShapesParallax() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 968;
    
    if (prefersReducedMotion || isMobile) {
      return;
    }
    
    const shapes = document.querySelectorAll('.floating-shape');
    
    if (shapes.length === 0) return;
    
    let mouseXPercent = 0;
    let mouseYPercent = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseXPercent = (e.clientX / window.innerWidth) - 0.5;
      mouseYPercent = (e.clientY / window.innerHeight) - 0.5;
    });
    
    function animateShapes() {
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = mouseXPercent * speed;
        const y = mouseYPercent * speed;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      requestAnimationFrame(animateShapes);
    }
    
    animateShapes();
  }
  
  // ============================================
  // 6) INITIALIZE ALL EFFECTS
  // ============================================
  
  function initAllEffects() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAllEffects);
      return;
    }
    
    // Initialize cursor glow
    initCursorGlow();
    
    // Initialize parallax (wait a bit for layout to settle)
    setTimeout(() => {
      initParallax();
      initFloatingShapesParallax();
    }, 100);
    
    // Initialize page transition
    initPageTransition();
    
    // Initialize 3D hover effects
    setTimeout(() => {
      init3DHoverEffect();
    }, 200);
    
    // Re-initialize on dynamic content changes (for SPAs)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // Re-scan for parallax elements
              if (node.classList && node.classList.contains('parallax-layer')) {
                parallaxElements.push(node);
              }
              
              // Re-scan for premium cards
              if (node.classList && node.classList.contains('card-premium')) {
                init3DHoverEffect();
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // ============================================
  // 7) UTILITY FUNCTIONS (Global Access)
  // ============================================
  
  // Expose utility to re-initialize effects (useful after dynamic content load)
  window.reinitEffects = function() {
    init3DHoverEffect();
    
    // Re-scan parallax elements
    parallaxElements = Array.from(document.querySelectorAll('.parallax-layer'));
    updateParallax();
  };
  
  // Expose function to temporarily disable effects
  window.toggleEffects = function(enabled) {
    if (cursorGlow) {
      cursorGlow.style.display = enabled ? 'block' : 'none';
    }
    
    if (!enabled) {
      parallaxElements.forEach(el => {
        el.style.transform = 'none';
      });
    } else {
      updateParallax();
    }
  };
  
  // ============================================
  // AUTO-INITIALIZE
  // ============================================
  
  initAllEffects();
  
})();

/* ============================================
   WHATSAPP HELPER FUNCTIONS (Global Scope)
   ============================================ */

/**
 * Open WhatsApp with a custom message
 * @param {string} message - The message to send
 * @param {string} phone - Phone number (default: 919XXXXXXXXX)
 */
function openWhatsAppWithMessage(message, phone = '919XXXXXXXXX') {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/**
 * Open WhatsApp for product order
 * @param {string} productName - Name of the product
 */
function orderViaWhatsApp(productName) {
  const message = `Hello SoyaSatva, I want to order: ${productName}. Please share price & delivery details.`;
  openWhatsAppWithMessage(message);
}

/**
 * Open WhatsApp for general inquiry
 */
function openWhatsAppInquiry() {
  const message = 'Hello SoyaSatva, I have a question about your products.';
  openWhatsAppWithMessage(message);
}

console.log('✅ Effects.js loaded - Premium animations active!');

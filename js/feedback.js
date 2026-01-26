/* ============================================
   FEEDBACK.JS - Customer Feedback System
   Features: Star ratings, localStorage, display grid
   No external libraries - Pure JavaScript
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // 1) CONFIGURATION
  // ============================================
  
  const STORAGE_KEY = 'soyasatva_feedback';
  const MAX_FEEDBACK_LENGTH = 250;
  const MAX_DISPLAY_ITEMS = 6;
  
  // ============================================
  // 2) STAR RATING COMPONENT
  // ============================================
  
  class StarRating {
    constructor(containerElement, onChange) {
      this.container = containerElement;
      this.onChange = onChange;
      this.rating = 0;
      this.stars = [];
      this.render();
    }
    
    render() {
      this.container.innerHTML = '';
      this.container.className = 'star-rating';
      
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '⭐';
        star.setAttribute('data-rating', i);
        star.setAttribute('tabindex', '0');
        star.setAttribute('role', 'button');
        star.setAttribute('aria-label', `Rate ${i} stars`);
        
        // Click event
        star.addEventListener('click', () => {
          this.setRating(i);
        });
        
        // Keyboard support
        star.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.setRating(i);
          }
        });
        
        // Hover effects
        star.addEventListener('mouseenter', () => {
          this.highlightStars(i);
        });
        
        this.container.appendChild(star);
        this.stars.push(star);
      }
      
      // Remove hover effect when leaving container
      this.container.addEventListener('mouseleave', () => {
        this.highlightStars(this.rating);
      });
    }
    
    setRating(rating) {
      this.rating = rating;
      this.highlightStars(rating);
      
      if (this.onChange) {
        this.onChange(rating);
      }
    }
    
    highlightStars(count) {
      this.stars.forEach((star, index) => {
        if (index < count) {
          star.classList.add('active');
          star.classList.remove('hover');
        } else {
          star.classList.remove('active');
          star.classList.add('hover');
        }
      });
    }
    
    getRating() {
      return this.rating;
    }
    
    reset() {
      this.rating = 0;
      this.stars.forEach(star => {
        star.classList.remove('active', 'hover');
      });
    }
  }
  
  // ============================================
  // 3) FEEDBACK STORAGE (localStorage)
  // ============================================
  
  class FeedbackStorage {
    static getAll() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Error reading feedback from localStorage:', error);
        return [];
      }
    }
    
    static save(feedback) {
      try {
        const allFeedback = this.getAll();
        allFeedback.unshift(feedback); // Add to beginning
        
        // Keep only the latest items
        const trimmed = allFeedback.slice(0, 50);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        return true;
      } catch (error) {
        console.error('Error saving feedback to localStorage:', error);
        return false;
      }
    }
    
    static clear() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      } catch (error) {
        console.error('Error clearing feedback:', error);
        return false;
      }
    }
    
    static getLatest(count = MAX_DISPLAY_ITEMS) {
      const all = this.getAll();
      return all.slice(0, count);
    }
  }
  
  // ============================================
  // 4) FEEDBACK FORM HANDLER
  // ============================================
  
  class FeedbackForm {
    constructor(formElement) {
      this.form = formElement;
      this.nameInput = this.form.querySelector('#feedbackName');
      this.messageInput = this.form.querySelector('#feedbackMessage');
      this.ratingContainer = this.form.querySelector('#feedbackRating');
      this.submitButton = this.form.querySelector('button[type="submit"]');
      
      if (!this.nameInput || !this.messageInput || !this.ratingContainer) {
        console.error('Feedback form elements not found');
        return;
      }
      
      // Initialize star rating
      this.starRating = new StarRating(this.ratingContainer, (rating) => {
        this.currentRating = rating;
      });
      
      this.currentRating = 0;
      
      this.init();
    }
    
    init() {
      // Form submit handler
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
      
      // Character counter for message
      if (this.messageInput) {
        this.messageInput.addEventListener('input', () => {
          this.updateCharCounter();
        });
        
        // Add character counter element
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'text-align: right; font-size: 0.85rem; color: var(--text-light); margin-top: 0.25rem;';
        this.messageInput.parentNode.appendChild(counter);
        this.charCounter = counter;
        this.updateCharCounter();
      }
    }
    
    updateCharCounter() {
      const length = this.messageInput.value.length;
      const remaining = MAX_FEEDBACK_LENGTH - length;
      
      if (this.charCounter) {
        this.charCounter.textContent = `${length}/${MAX_FEEDBACK_LENGTH} characters`;
        this.charCounter.style.color = remaining < 20 ? 'var(--danger)' : 'var(--text-light)';
      }
    }
    
    validateForm() {
      const name = this.nameInput.value.trim();
      const message = this.messageInput.value.trim();
      const rating = this.currentRating;
      
      // Validate name
      if (name.length < 2) {
        this.showError(this.nameInput, 'Please enter your full name');
        return false;
      }
      
      // Validate rating
      if (rating === 0) {
        if (window.showToast) {
          window.showToast('Please select a star rating', 'error');
        }
        return false;
      }
      
      // Validate message
      if (message.length < 10) {
        this.showError(this.messageInput, 'Please enter at least 10 characters');
        return false;
      }
      
      if (message.length > MAX_FEEDBACK_LENGTH) {
        this.showError(this.messageInput, `Message is too long (max ${MAX_FEEDBACK_LENGTH} characters)`);
        return false;
      }
      
      return true;
    }
    
    showError(input, message) {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        const errorEl = formGroup.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
        input.classList.add('error');
      }
      
      if (window.showToast) {
        window.showToast(message, 'error');
      }
    }
    
    clearErrors() {
      const errors = this.form.querySelectorAll('.form-error');
      errors.forEach(error => error.style.display = 'none');
      
      const inputs = this.form.querySelectorAll('.error');
      inputs.forEach(input => input.classList.remove('error'));
    }
    
    handleSubmit() {
      this.clearErrors();
      
      if (!this.validateForm()) {
        return;
      }
      
      // Create feedback object
      const feedback = {
        id: Date.now(),
        name: this.nameInput.value.trim(),
        rating: this.currentRating,
        message: this.messageInput.value.trim(),
        date: new Date().toISOString(),
        dateFormatted: this.formatDate(new Date())
      };
      
      // Save to storage
      const saved = FeedbackStorage.save(feedback);
      
      if (saved) {
        // Show success message
        if (window.showToast) {
          window.showToast('✅ Thanks for your feedback!', 'success');
        }
        
        // Reset form
        this.resetForm();
        
        // Refresh feedback display
        if (window.refreshFeedbackDisplay) {
          window.refreshFeedbackDisplay();
        }
      } else {
        if (window.showToast) {
          window.showToast('Failed to save feedback. Please try again.', 'error');
        }
      }
    }
    
    resetForm() {
      this.form.reset();
      this.starRating.reset();
      this.currentRating = 0;
      this.clearErrors();
      
      if (this.charCounter) {
        this.updateCharCounter();
      }
    }
    
    formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  }
  
  // ============================================
  // 5) FEEDBACK DISPLAY
  // ============================================
  
  class FeedbackDisplay {
    constructor(containerElement) {
      this.container = containerElement;
      this.render();
    }
    
    render() {
      const feedbackList = FeedbackStorage.getLatest();
      
      if (!this.container) {
        console.error('Feedback display container not found');
        return;
      }
      
      // Clear container
      this.container.innerHTML = '';
      
      if (feedbackList.length === 0) {
        this.showEmptyState();
        return;
      }
      
      // Create grid
      const grid = document.createElement('div');
      grid.className = 'grid grid-3';
      grid.style.gap = '2rem';
      
      feedbackList.forEach(feedback => {
        const card = this.createFeedbackCard(feedback);
        grid.appendChild(card);
      });
      
      this.container.appendChild(grid);
    }
    
    createFeedbackCard(feedback) {
      const card = document.createElement('div');
      card.className = 'feedback-card reveal';
      
      card.innerHTML = `
        <div class="feedback-header">
          <div class="feedback-author">${this.escapeHtml(feedback.name)}</div>
          <div class="feedback-date">${feedback.dateFormatted}</div>
        </div>
        <div class="feedback-rating">
          ${this.renderStars(feedback.rating)}
        </div>
        <div class="feedback-message">${this.escapeHtml(feedback.message)}</div>
      `;
      
      return card;
    }
    
    renderStars(rating) {
      let html = '<div class="star-rating-display">';
      
      for (let i = 1; i <= 5; i++) {
        const className = i <= rating ? 'star filled' : 'star empty';
        html += `<span class="${className}">⭐</span>`;
      }
      
      html += '</div>';
      return html;
    }
    
    showEmptyState() {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-light);">
          <div style="font-size: 4rem; margin-bottom: 1rem;">💬</div>
          <h3 style="color: var(--text-dark); margin-bottom: 0.5rem;">No feedback yet</h3>
          <p>Be the first to share your experience with SoyaSatva!</p>
        </div>
      `;
    }
    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    refresh() {
      this.render();
    }
  }
  
  // ============================================
  // 6) CLEAR FEEDBACK HANDLER
  // ============================================
  
  function initClearButton() {
    const clearButton = document.getElementById('clearFeedbackBtn');
    
    if (!clearButton) return;
    
    clearButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all feedback? This cannot be undone.')) {
        FeedbackStorage.clear();
        
        if (window.showToast) {
          window.showToast('All feedback cleared', 'success');
        }
        
        if (window.refreshFeedbackDisplay) {
          window.refreshFeedbackDisplay();
        }
      }
    });
  }
  
  // ============================================
  // 7) INITIALIZE FEEDBACK SYSTEM
  // ============================================
  
  let feedbackDisplay = null;
  
  function initFeedbackSystem() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFeedbackSystem);
      return;
    }
    
    // Initialize feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
      new FeedbackForm(feedbackForm);
    }
    
    // Initialize feedback display
    const displayContainer = document.getElementById('feedbackDisplay');
    if (displayContainer) {
      feedbackDisplay = new FeedbackDisplay(displayContainer);
    }
    
    // Initialize clear button
    initClearButton();
  }
  
  // ============================================
  // 8) GLOBAL FUNCTIONS
  // ============================================
  
  // Expose function to refresh feedback display
  window.refreshFeedbackDisplay = function() {
    if (feedbackDisplay) {
      feedbackDisplay.refresh();
    }
  };
  
  // Expose function to get feedback count
  window.getFeedbackCount = function() {
    return FeedbackStorage.getAll().length;
  };
  
  // Expose function to clear feedback (programmatic)
  window.clearAllFeedback = function() {
    return FeedbackStorage.clear();
  };
  
  // ============================================
  // AUTO-INITIALIZE
  // ============================================
  
  initFeedbackSystem();
  
  console.log('✅ Feedback.js loaded - Customer feedback system ready!');
  
})();

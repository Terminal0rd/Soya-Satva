/* ========================================
   SoyaSatva - Contact Page JavaScript
   Form Validation & Success Messages
   ======================================== */

// ===== Initialize Contact Page =====
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('contact.html')) {
    initContactForm();
  }
});

// ===== Contact Form Validation & Submission =====
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    // Clear previous errors
    clearFormErrors();
    
    // Validation flags
    let isValid = true;
    
    // Validate name
    if (!nameInput.value.trim()) {
      showFieldError(nameInput, 'Name is required');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Name must be at least 2 characters');
      isValid = false;
    }
    
    // Validate email
    if (!emailInput.value.trim()) {
      showFieldError(emailInput, 'Email is required');
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showFieldError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate phone
    if (!phoneInput.value.trim()) {
      showFieldError(phoneInput, 'Phone number is required');
      isValid = false;
    } else if (!validatePhone(phoneInput.value)) {
      showFieldError(phoneInput, 'Please enter a valid phone number (at least 10 digits)');
      isValid = false;
    }
    
    // Validate message
    if (!messageInput.value.trim()) {
      showFieldError(messageInput, 'Message is required');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showFieldError(messageInput, 'Message must be at least 10 characters');
      isValid = false;
    }
    
    // If form is valid, submit
    if (isValid) {
      submitContactForm({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        message: messageInput.value.trim()
      });
    }
  });
  
  // Real-time validation
  const inputs = contactForm.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      // Clear error when user starts typing
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        const errorElement = this.parentElement.querySelector('.form-error');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    });
  });
}

// ===== Field Validation =====
function validateField(input) {
  const fieldName = input.getAttribute('id');
  const value = input.value.trim();
  
  switch(fieldName) {
    case 'name':
      if (!value) {
        showFieldError(input, 'Name is required');
        return false;
      } else if (value.length < 2) {
        showFieldError(input, 'Name must be at least 2 characters');
        return false;
      }
      break;
      
    case 'email':
      if (!value) {
        showFieldError(input, 'Email is required');
        return false;
      } else if (!validateEmail(value)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
      }
      break;
      
    case 'phone':
      if (!value) {
        showFieldError(input, 'Phone number is required');
        return false;
      } else if (!validatePhone(value)) {
        showFieldError(input, 'Please enter a valid phone number');
        return false;
      }
      break;
      
    case 'message':
      if (!value) {
        showFieldError(input, 'Message is required');
        return false;
      } else if (value.length < 10) {
        showFieldError(input, 'Message must be at least 10 characters');
        return false;
      }
      break;
  }
  
  clearFieldError(input);
  return true;
}

// ===== Show Field Error =====
function showFieldError(input, message) {
  input.classList.add('error');
  
  let errorElement = input.parentElement.querySelector('.form-error');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    input.parentElement.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// ===== Clear Field Error =====
function clearFieldError(input) {
  input.classList.remove('error');
  const errorElement = input.parentElement.querySelector('.form-error');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

// ===== Clear All Form Errors =====
function clearFormErrors() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  const errorInputs = form.querySelectorAll('.form-control.error');
  errorInputs.forEach(input => {
    clearFieldError(input);
  });
}

// ===== Submit Contact Form =====
function submitContactForm(formData) {
  const submitButton = document.querySelector('#contactForm button[type="submit"]');
  
  // Disable button and show loading state
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }
  
  // Simulate API call (in real application, this would be an actual API request)
  setTimeout(() => {
    // Show success message
    showToast('Thank you! Your message has been sent successfully. We\'ll get back to you soon!', 'success', 4000);
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Re-enable button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
    
    // Log form data (for development)
    console.log('Form submitted:', formData);
    
    // Optional: Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 1500);
}

// ===== Email Validation =====
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

// ===== Phone Validation =====
function validatePhone(phone) {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's a valid phone number (10 or more digits)
  const re = /^\+?[\d]{10,}$/;
  return re.test(cleaned);
}

// ===== WhatsApp Click Handler =====
function openWhatsApp() {
  // Replace with actual WhatsApp number
  const phoneNumber = '918424045519'; // Update with actual number
  const message = encodeURIComponent('Hi! I would like to know more about SoyaSatva products.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  
  window.open(whatsappUrl, '_blank');
}

// Make function globally available
window.openWhatsApp = openWhatsApp;

// ===== Google Maps Integration Helper =====
function initMap() {
  // This function would be called if you integrate Google Maps API
  // For now, we're using an embed placeholder in the HTML
  console.log('Map initialized');
}

// ===== Newsletter Subscription =====
function subscribeNewsletter() {
  const emailInput = document.getElementById('newsletterEmail');
  
  if (!emailInput) return;
  
  const email = emailInput.value.trim();
  
  if (!email) {
    showToast('Please enter your email address', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Simulate subscription
  showToast('Successfully subscribed to our newsletter!', 'success');
  emailInput.value = '';
}

// Make function globally available
window.subscribeNewsletter = subscribeNewsletter;

// ===== Quick Contact Buttons =====
function initQuickContact() {
  const phoneButton = document.querySelector('.quick-phone');
  const emailButton = document.querySelector('.quick-email');
  
  if (phoneButton) {
    phoneButton.addEventListener('click', function() {
      showToast('Calling +91 8424045519...', 'success');
    });
  }
  
  if (emailButton) {
    emailButton.addEventListener('click', function() {
      showToast('Opening email client...', 'success');
    });
  }
}

// Initialize quick contact on page load
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('contact.html')) {
    initQuickContact();
  }
});

// ===== Form Input Formatting =====
document.addEventListener('DOMContentLoaded', function() {
  // Format phone number input as user types
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      // Allow only numbers, spaces, dashes, parentheses, and plus
      let value = e.target.value;
      value = value.replace(/[^0-9\s\-\(\)\+]/g, '');
      e.target.value = value;
    });
  }
});

// ===== Contact Info Click to Copy =====
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} copied to clipboard!`, 'success', 2000);
  }).catch(() => {
    showToast('Failed to copy. Please try again.', 'error');
  });
}

// Make function globally available
window.copyToClipboard = copyToClipboard;

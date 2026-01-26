/**
 * COMPARE.JS - Product Comparison System
 * Manages product comparison with localStorage persistence
 */

(function() {
    'use strict';

    // ============================================
    // 1) COMPARE SYSTEM CLASS
    // ============================================
    
    class CompareSystem {
        constructor() {
            this.maxProducts = 3;
            this.storageKey = 'soyasatva_compare';
            this.selectedProducts = this.loadFromStorage();
            this.bar = null;
            this.modal = null;
            this.init();
        }

        init() {
            this.createBar();
            this.createModal();
            this.setupEventListeners();
            this.updateUI();
            
            // Listen for products being rendered
            document.addEventListener('DOMContentLoaded', () => {
                this.syncToggleStates();
            });
        }

        // ============================================
        // 2) STORAGE METHODS
        // ============================================

        loadFromStorage() {
            try {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.error('Error loading compare data:', e);
                return [];
            }
        }

        saveToStorage() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.selectedProducts));
            } catch (e) {
                console.error('Error saving compare data:', e);
            }
        }

        // ============================================
        // 3) PRODUCT SELECTION METHODS
        // ============================================

        addProduct(product) {
            if (this.selectedProducts.length >= this.maxProducts) {
                window.PremiumToast?.warning(`Maximum ${this.maxProducts} products can be compared!`) || 
                    alert(`You can only compare up to ${this.maxProducts} products`);
                return false;
            }

            if (!this.isProductSelected(product.id)) {
                this.selectedProducts.push(product);
                this.saveToStorage();
                this.updateUI();
                window.PremiumToast?.success(`${product.name} added to compare`) ||
                    console.log('Added to compare');
                return true;
            }
            return false;
        }

        removeProduct(productId) {
            const product = this.selectedProducts.find(p => p.id === productId);
            this.selectedProducts = this.selectedProducts.filter(p => p.id !== productId);
            this.saveToStorage();
            this.updateUI();
            this.syncToggleStates();
            
            if (product) {
                window.PremiumToast?.info(`${product.name} removed from compare`) ||
                    console.log('Removed from compare');
            }
        }

        clearAll() {
            this.selectedProducts = [];
            this.saveToStorage();
            this.updateUI();
            this.syncToggleStates();
            window.PremiumToast?.info('Compare list cleared') || 
                console.log('Compare cleared');
        }

        isProductSelected(productId) {
            return this.selectedProducts.some(p => p.id === productId);
        }

        getSelectedCount() {
            return this.selectedProducts.length;
        }

        // ============================================
        // 4) UI CREATION METHODS
        // ============================================

        createBar() {
            this.bar = document.createElement('div');
            this.bar.className = 'compare-bar';
            this.bar.innerHTML = `
                <div class="compare-bar-content">
                    <div class="compare-bar-left">
                        <span class="compare-count">0 products selected</span>
                        <div class="compare-chips"></div>
                    </div>
                    <div class="compare-bar-actions">
                        <button class="compare-bar-btn compare-bar-btn-secondary" data-action="clear">
                            Clear All
                        </button>
                        <button class="compare-bar-btn compare-bar-btn-primary" data-action="compare">
                            Compare Now
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(this.bar);
        }

        createModal() {
            this.modal = document.createElement('div');
            this.modal.className = 'compare-modal';
            this.modal.innerHTML = `
                <div class="compare-modal-content">
                    <div class="compare-modal-header">
                        <h2 class="compare-modal-title">Product Comparison</h2>
                        <button class="compare-modal-close" aria-label="Close comparison">×</button>
                    </div>
                    <div class="compare-modal-body">
                        <!-- Dynamic content -->
                    </div>
                </div>
            `;
            document.body.appendChild(this.modal);
        }

        // ============================================
        // 5) UI UPDATE METHODS
        // ============================================

        updateUI() {
            this.updateBar();
            this.updateToggles();
        }

        updateBar() {
            const count = this.getSelectedCount();
            const countEl = this.bar.querySelector('.compare-count');
            const chipsEl = this.bar.querySelector('.compare-chips');

            // Update count text
            countEl.textContent = count === 1 ? '1 product selected' : `${count} products selected`;

            // Show/hide bar
            if (count > 0) {
                this.bar.classList.add('visible');
            } else {
                this.bar.classList.remove('visible');
            }

            // Render chips
            chipsEl.innerHTML = this.selectedProducts.map(product => `
                <div class="compare-chip">
                    <span>${product.emoji || '📦'} ${product.name}</span>
                    <button 
                        class="compare-chip-remove" 
                        data-product-id="${product.id}"
                        aria-label="Remove ${product.name}"
                    >×</button>
                </div>
            `).join('');
        }

        updateToggles() {
            document.querySelectorAll('.compare-toggle input').forEach(toggle => {
                const productId = parseInt(toggle.dataset.productId);
                toggle.checked = this.isProductSelected(productId);
            });
        }

        syncToggleStates() {
            this.updateToggles();
        }

        // ============================================
        // 6) MODAL METHODS
        // ============================================

        openModal() {
            if (this.getSelectedCount() === 0) {
                window.PremiumToast?.warning('Please select products to compare') ||
                    alert('Please select products to compare');
                return;
            }

            this.renderModalContent();
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            const closeBtn = this.modal.querySelector('.compare-modal-close');
            closeBtn?.focus();
        }

        closeModal() {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        renderModalContent() {
            const body = this.modal.querySelector('.compare-modal-body');

            if (this.getSelectedCount() === 0) {
                body.innerHTML = `
                    <div class="compare-empty">
                        <div class="compare-empty-icon">🔍</div>
                        <h3 class="compare-empty-title">No Products Selected</h3>
                        <p class="compare-empty-text">Start comparing by selecting products from the catalog</p>
                    </div>
                `;
                return;
            }

            body.innerHTML = `
                <div class="comparison-table-wrapper">
                    <table class="comparison-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                ${this.selectedProducts.map(p => `
                                    <th class="product-header-cell">
                                        <span class="product-icon">${p.emoji || '📦'}</span>
                                        <div class="product-name">${p.name}</div>
                                        <div class="product-category">${p.category}</div>
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderComparisonRows()}
                        </tbody>
                    </table>
                </div>
            `;

            // Add scroll hint if needed
            setTimeout(() => {
                const wrapper = body.querySelector('.comparison-table-wrapper');
                if (wrapper && wrapper.scrollWidth > wrapper.clientWidth) {
                    wrapper.classList.add('has-scroll');
                }
            }, 100);
        }

        renderComparisonRows() {
            const prices = this.selectedProducts.map(p => typeof p.price === 'string' ? parseFloat(p.price.replace(/[^\d.]/g, '')) : p.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            const rows = [
                {
                    label: 'Price',
                    values: this.selectedProducts.map((p, i) => ({
                        value: `₹${prices[i]}`,
                        isBest: prices[i] === minPrice && minPrice !== maxPrice,
                        html: `<span class="price-badge ${this.getPriceTier(prices[i])}">${prices[i]} ₹</span>`
                    }))
                },
                {
                    label: 'Category',
                    values: this.selectedProducts.map(p => ({ value: p.category }))
                },
                {
                    label: 'Description',
                    values: this.selectedProducts.map(p => ({ value: p.shortDesc || p.fullDesc?.substring(0, 80) + '...' || 'No description' }))
                },
                {
                    label: 'Popularity',
                    values: this.selectedProducts.map(p => ({ 
                        value: p.popularity || 'N/A',
                        html: this.getPopularityStars(p.popularity)
                    }))
                },
                {
                    label: 'Badge',
                    values: this.selectedProducts.map(p => ({ 
                        value: p.badge || 'Standard',
                        html: p.badge ? `<span class="badge badge-${p.badge.toLowerCase().replace(/\s+/g, '-')}">${p.badge}</span>` : 'Standard'
                    }))
                },
                {
                    label: 'Nutrition',
                    values: this.selectedProducts.map(p => ({ 
                        value: p.nutrition || 'Nutrition info not available'
                    }))
                },
                {
                    label: 'Usage',
                    values: this.selectedProducts.map(p => ({ 
                        value: p.usage || p.fullDesc || 'Usage info not available'
                    }))
                }
            ];

            // Add action row
            rows.push({
                label: 'Action',
                values: this.selectedProducts.map((p, i) => ({
                    html: `
                        <button 
                            class="compare-order-btn" 
                            data-product-name="${p.name}"
                            data-product-price="${prices[i]}"
                        >
                            <span>🛒</span> Order on WhatsApp
                        </button>
                    `
                }))
            });

            return rows.map(row => `
                <tr>
                    <td>${row.label}</td>
                    ${row.values.map(val => `
                        <td class="value-cell ${val.isBest ? 'value-best' : ''}">
                            ${val.html || val.value}
                        </td>
                    `).join('')}
                </tr>
            `).join('');
        }

        getPriceTier(price) {
            if (price < 150) return 'budget';
            if (price < 300) return 'standard';
            return 'premium';
        }

        getPopularityStars(popularity) {
            if (!popularity) return 'N/A';
            const stars = '⭐'.repeat(Math.min(5, Math.max(1, popularity)));
            return stars;
        }

        // ============================================
        // 7) EVENT LISTENERS
        // ============================================

        setupEventListeners() {
            // Compare bar actions
            this.bar.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]')?.dataset.action;
                if (action === 'clear') {
                    this.clearAll();
                } else if (action === 'compare') {
                    this.openModal();
                }

                // Chip remove buttons
                const removeBtn = e.target.closest('.compare-chip-remove');
                if (removeBtn) {
                    const productId = parseInt(removeBtn.dataset.productId);
                    this.removeProduct(productId);
                }
            });

            // Modal close
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.closest('.compare-modal-close')) {
                    this.closeModal();
                }
            });

            // Modal WhatsApp buttons
            this.modal.addEventListener('click', (e) => {
                const orderBtn = e.target.closest('.compare-order-btn');
                if (orderBtn) {
                    const name = orderBtn.dataset.productName;
                    const price = orderBtn.dataset.productPrice;
                    this.orderViaWhatsApp(name, price);
                }
            });

            // Product toggle listeners (delegated)
            document.addEventListener('change', (e) => {
                if (e.target.matches('.compare-toggle input')) {
                    this.handleToggleChange(e.target);
                }
            });

            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.closeModal();
                }
            });
        }

        handleToggleChange(toggle) {
            const productId = parseInt(toggle.dataset.productId);
            
            // Get full product data from global productsData if available
            let product;
            if (window.productsData) {
                product = window.productsData.find(p => p.id === productId);
            }
            
            // Fallback to extracting from card if productsData not available
            if (!product) {
                const productCard = toggle.closest('.product-card');
                if (!productCard) return;

                product = {
                    id: productId,
                    name: productCard.querySelector('h3, .product-title')?.textContent || 'Unknown Product',
                    category: productCard.querySelector('.product-category')?.textContent || 'Unknown',
                    price: parseFloat(productCard.querySelector('.price, .product-price')?.textContent.replace(/[^\d.]/g, '')) || 0,
                    emoji: productCard.querySelector('.product-emoji')?.textContent || '📦',
                    shortDesc: productCard.querySelector('.product-description')?.textContent || '',
                    badge: productCard.querySelector('.badge, .product-badge')?.textContent || '',
                    popularity: parseInt(productCard.dataset.popularity) || 0
                };
            }

            if (toggle.checked) {
                const added = this.addProduct(product);
                if (!added) {
                    toggle.checked = false; // Revert if max reached
                }
            } else {
                this.removeProduct(productId);
            }
        }

        // ============================================
        // 8) WHATSAPP INTEGRATION
        // ============================================

        orderViaWhatsApp(productName, price) {
            const message = `Hi! I'm interested in ordering *${productName}* (₹${price}) from your comparison. Please share details about availability and delivery.`;
            const phone = '919876543210'; // Replace with actual number
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }

        // ============================================
        // 9) PUBLIC API
        // ============================================

        getSelectedProducts() {
            return [...this.selectedProducts];
        }

        resetCompare() {
            this.clearAll();
        }
    }

    // ============================================
    // 10) INITIALIZE & EXPORT
    // ============================================

    let compareSystem;

    function initCompareSystem() {
        if (compareSystem) return compareSystem;
        compareSystem = new CompareSystem();
        return compareSystem;
    }

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompareSystem);
    } else {
        initCompareSystem();
    }

    // Global API
    window.CompareSystem = {
        getInstance: () => compareSystem,
        addProduct: (product) => compareSystem?.addProduct(product),
        removeProduct: (id) => compareSystem?.removeProduct(id),
        clearAll: () => compareSystem?.clearAll(),
        getSelected: () => compareSystem?.getSelectedProducts() || [],
        openCompare: () => compareSystem?.openModal()
    };

})();

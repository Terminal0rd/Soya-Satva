/* ========================================
   SoyaSatva - Products Page JavaScript
   Product Modal, Filters, Search & Interactions
   ======================================== */

// ===== Products Data =====
const productsData = [
  {
    id: 1,
    name: 'Premium Tofu Block',
    category: 'tofu',
    price: '₹89',
    popularity: 5,
    badge: 'Popular',
    emoji: '🧈',
    shortDesc: 'Soft, protein-rich tofu perfect for curries and stir-fries',
    fullDesc: 'Our premium tofu is made from high-quality non-GMO soybeans. Soft and versatile, it absorbs flavors beautifully in any dish.',
    nutrition: 'High in protein (12g per 100g), low in calories, cholesterol-free',
    usage: 'Ideal for curries, stir-fries, scrambles, grilling, and salads'
  },
  {
    id: 2,
    name: 'Soy Milk Original',
    category: 'milk',
    price: '₹65',
    popularity: 5,
    badge: 'Bestseller',
    emoji: '🥛',
    shortDesc: 'Creamy, unsweetened soy milk packed with nutrients',
    fullDesc: 'Fresh soy milk made daily from organic soybeans. Creamy texture with natural sweetness and no added sugar.',
    nutrition: 'Rich in protein (7g per 200ml), fortified with calcium and vitamin D',
    usage: 'Perfect for coffee, smoothies, cereals, cooking, and baking'
  },
  {
    id: 3,
    name: 'Textured Soy Chunks',
    category: 'protein',
    price: '₹120',
    popularity: 4,
    badge: 'High Protein',
    emoji: '💪',
    shortDesc: 'Dehydrated soy chunks - meat alternative for fitness lovers',
    fullDesc: 'Our textured soy chunks are a perfect meat substitute. High in protein, low in fat, and incredibly versatile.',
    nutrition: 'Extremely high protein (52g per 100g dry), zero cholesterol, rich in iron',
    usage: 'Rehydrate and use in curries, pulao, biryanis, or as a meat replacement'
  },
  {
    id: 4,
    name: 'Soy Flour (Gluten-Free)',
    category: 'flour',
    price: '₹95',
    popularity: 3,
    badge: 'Gluten-Free',
    emoji: '🌾',
    shortDesc: 'Finely ground soy flour for baking and nutrition boost',
    fullDesc: 'Finely milled from roasted soybeans. Perfect for gluten-free baking and adding protein to your recipes.',
    nutrition: 'High protein (40g per 100g), rich in fiber, good source of iron and B vitamins',
    usage: 'Use in pancakes, breads, muffins, thickening soups, or protein shakes'
  },
  {
    id: 5,
    name: 'Crispy Soy Snacks',
    category: 'snacks',
    price: '₹75',
    popularity: 4,
    badge: 'Crunchy',
    emoji: '🍿',
    shortDesc: 'Roasted soy bites - healthy evening snack',
    fullDesc: 'Lightly seasoned and roasted to perfection. A guilt-free crunchy snack that satisfies cravings.',
    nutrition: 'Good source of protein (18g per 100g), low in sugar, contains healthy fats',
    usage: 'Enjoy as is, add to trail mix, or sprinkle on salads'
  },
  {
    id: 6,
    name: 'Silken Tofu',
    category: 'tofu',
    price: '₹95',
    popularity: 4,
    badge: 'Smooth',
    emoji: '🍮',
    shortDesc: 'Ultra-soft silken tofu for desserts and smoothies',
    fullDesc: 'Delicate and creamy silken tofu with a custard-like texture. Perfect for blending into smooth dishes.',
    nutrition: 'Moderate protein (6g per 100g), very low calorie, cholesterol-free',
    usage: 'Ideal for smoothies, desserts, dips, dressings, and soups'
  },
  {
    id: 7,
    name: 'Soy Milk Chocolate',
    category: 'milk',
    price: '₹70',
    popularity: 5,
    badge: 'Kids Love It',
    emoji: '🍫',
    shortDesc: 'Delicious chocolate soy milk - dairy-free indulgence',
    fullDesc: 'Creamy chocolate soy milk sweetened naturally. A delicious dairy-free treat for kids and adults.',
    nutrition: 'Good protein (6g per 200ml), calcium enriched, no lactose',
    usage: 'Drink chilled, add to coffee, or use in milkshakes'
  },
  {
    id: 8,
    name: 'Mini Soy Chunks',
    category: 'protein',
    price: '₹110',
    popularity: 4,
    badge: 'Quick Cook',
    emoji: '🥘',
    shortDesc: 'Small-sized soy chunks for faster cooking',
    fullDesc: 'Mini-sized textured soy protein that rehydrates quickly. Perfect for quick meals and meal prep.',
    nutrition: 'Very high protein (50g per 100g dry), low fat, iron-rich',
    usage: 'Quick curries, pasta sauces, fried rice, wraps, and meal bowls'
  },
  {
    id: 9,
    name: 'Soy Protein Powder',
    category: 'protein',
    price: '₹450',
    popularity: 5,
    badge: 'Fitness',
    emoji: '🏋️',
    shortDesc: 'Isolated soy protein for post-workout recovery',
    fullDesc: 'Premium isolated soy protein powder with 90% protein content. Ideal for athletes and fitness enthusiasts.',
    nutrition: 'Ultra-high protein (90g per 100g), very low fat, contains all essential amino acids',
    usage: 'Mix with water/milk for shakes, add to oats, smoothies, or protein bars'
  },
  {
    id: 10,
    name: 'Marinated Tofu Cubes',
    category: 'tofu',
    price: '₹135',
    popularity: 3,
    badge: 'Ready to Cook',
    emoji: '🍢',
    shortDesc: 'Pre-marinated tofu cubes - just cook and serve',
    fullDesc: 'Tofu cubes pre-marinated in aromatic Indian spices. Just pan-fry or grill for instant deliciousness.',
    nutrition: 'High protein (14g per 100g), pre-seasoned, preservative-free',
    usage: 'Pan-fry, grill, air-fry, or add to curries and rice bowls'
  },
  {
    id: 11,
    name: 'Soy Granules',
    category: 'protein',
    price: '₹100',
    popularity: 4,
    badge: 'Versatile',
    emoji: '🌰',
    shortDesc: 'Fine soy granules - perfect keema substitute',
    fullDesc: 'Finely textured soy granules that mimic minced meat texture. A fantastic vegetarian keema alternative.',
    nutrition: 'High protein (52g per 100g dry), zero cholesterol, easy to digest',
    usage: 'Use in keema, stuffed parathas, cutlets, burger patties, or Bolognese'
  },
  {
    id: 12,
    name: 'Vanilla Soy Milk',
    category: 'milk',
    price: '₹70',
    popularity: 4,
    badge: 'Sweet',
    emoji: '🍦',
    shortDesc: 'Smooth vanilla-flavored soy milk',
    fullDesc: 'Delightfully smooth soy milk with natural vanilla flavor. Lightly sweetened for a delicious taste.',
    nutrition: 'Protein (6g per 200ml), calcium fortified, naturally sweet',
    usage: 'Enjoy chilled, use in desserts, lattes, or overnight oats'
  }
];

// ===== Initialize Products Page =====
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('products.html')) {
    initProductsPage();
  }
});

function initProductsPage() {
  renderProducts(productsData);
  initFilters();
  initSearch();
  initSort();
}

// ===== Render Products =====
function renderProducts(products) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;
  
  productGrid.innerHTML = '';
  
  if (products.length === 0) {
    productGrid.innerHTML = '<p class="no-products">No products found. Try different filters.</p>';
    return;
  }
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card reveal';
  card.setAttribute('data-category', product.category);
  
  card.innerHTML = `
    <div class="product-image">
      <span style="font-size: 4rem;">${product.emoji}</span>
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
    </div>
    <div class="product-info">
      <div class="product-category">${product.category}</div>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.shortDesc}</p>
      <div class="product-footer">
        <span class="product-price">${product.price}</span>
        <button class="btn btn-accent btn-sm" onclick="openProductModal(${product.id})">
          View Details
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// ===== Product Modal =====
function openProductModal(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('productModal');
  if (!modal) return;
  
  // Populate modal content
  document.getElementById('modalProductEmoji').textContent = product.emoji;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductCategory').textContent = product.category;
  document.getElementById('modalProductPrice').textContent = product.price;
  document.getElementById('modalProductDesc').textContent = product.fullDesc;
  document.getElementById('modalProductNutrition').textContent = product.nutrition;
  document.getElementById('modalProductUsage').textContent = product.usage;
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Store current product for inquiry
  modal.setAttribute('data-product-id', productId);
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Add to inquiry
function addToInquiry() {
  const modal = document.getElementById('productModal');
  const productId = modal ? modal.getAttribute('data-product-id') : null;
  
  if (productId) {
    const product = productsData.find(p => p.id === parseInt(productId));
    if (product) {
      showToast(`${product.name} added to inquiry list!`, 'success');
      closeProductModal();
    }
  }
}

// Make functions globally available
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.addToInquiry = addToInquiry;

// ===== Category Filter =====
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter category
      const category = this.getAttribute('data-category');
      
      // Filter products
      if (category === 'all') {
        renderProducts(productsData);
      } else {
        const filtered = productsData.filter(p => p.category === category);
        renderProducts(filtered);
      }
    });
  });
}

// ===== Search Functionality =====
function initSearch() {
  const searchInput = document.getElementById('productSearch');
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      
      const filtered = productsData.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.category.toLowerCase().includes(searchTerm) ||
               product.shortDesc.toLowerCase().includes(searchTerm);
      });
      
      renderProducts(filtered);
    });
  }
}

// ===== Sort Functionality =====
function initSort() {
  const sortSelect = document.getElementById('productSort');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function(e) {
      const sortValue = e.target.value;
      let sortedProducts = [...productsData];
      
      switch(sortValue) {
        case 'popularity':
          sortedProducts.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'price-low':
          sortedProducts.sort((a, b) => {
            const priceA = parseInt(a.price.replace('₹', ''));
            const priceB = parseInt(b.price.replace('₹', ''));
            return priceA - priceB;
          });
          break;
        case 'price-high':
          sortedProducts.sort((a, b) => {
            const priceA = parseInt(a.price.replace('₹', ''));
            const priceB = parseInt(b.price.replace('₹', ''));
            return priceB - priceA;
          });
          break;
        case 'name':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      
      renderProducts(sortedProducts);
    });
  }
}

// ===== Product Card Hover Effect =====
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effect to product cards after they're rendered
  setTimeout(() => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
    });
  }, 100);
});

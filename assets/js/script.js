/* ============================================
   SERENE MEDS - CUSTOM JAVASCRIPT
   Interactive Functionality
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // INITIALIZATION
    // ============================================

    document.addEventListener('DOMContentLoaded', function() {
        initializeEventListeners();
        initializeCart();
        initializeSearch();
        initializeFilters();
    });

    // ============================================
    // CART FUNCTIONALITY
    // ============================================

    let cart = {
        items: [],
        total: 0
    };

    function initializeCart() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('sereneCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }

        // Add event listeners to all add-to-cart buttons
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                addToCart(this);
            });
        });
    }

    function addToCart(button) {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;

        // Extract price value
        const priceValue = parseFloat(productPrice.replace('PKR ', '').replace(',', ''));

        // Add item to cart
        const cartItem = {
            id: Date.now(),
            name: productName,
            price: priceValue,
            quantity: 1
        };

        cart.items.push(cartItem);
        cart.total += priceValue;

        // Save to localStorage
        localStorage.setItem('sereneCart', JSON.stringify(cart));

        // Show notification
        showNotification(`${productName} added to cart!`, 'success');

        // Update cart count
        updateCartCount();

        // Add animation to button
        button.style.backgroundColor = '#10B981';
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        setTimeout(() => {
            button.style.backgroundColor = '';
            button.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        }, 2000);
    }

    function updateCartCount() {
        const cartLink = document.querySelector('.action-link i.fa-shopping-cart').parentElement;
        if (cartLink) {
            let countBadge = cartLink.querySelector('.cart-count');
            if (!countBadge) {
                countBadge = document.createElement('span');
                countBadge.className = 'cart-count';
                countBadge.style.cssText = 'background-color: #EF4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; margin-left: 5px;';
                cartLink.appendChild(countBadge);
            }
            countBadge.textContent = cart.items.length;
        }
    }

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================

    function initializeSearch() {
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.btn-search');

        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch(this.value);
                }
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', function() {
                const searchTerm = searchInput.value;
                performSearch(searchTerm);
            });
        }
    }

    function performSearch(searchTerm) {
        if (searchTerm.trim() === '') {
            showNotification('Please enter a search term', 'warning');
            return;
        }

        // Filter products based on search term
        const productCards = document.querySelectorAll('.product-card');
        let matchCount = 0;

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            if (productName.includes(searchTerm.toLowerCase())) {
                card.style.display = '';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (matchCount === 0) {
            showNotification(`No products found for "${searchTerm}"`, 'info');
        } else {
            showNotification(`Found ${matchCount} product(s)`, 'success');
        }
    }

    // ============================================
    // FILTER FUNCTIONALITY
    // ============================================

    function initializeFilters() {
        const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                applyFilters();
            });
        });
    }

    function applyFilters() {
        // Get selected categories and brands
        const selectedCategories = getSelectedFilters('category');
        const selectedBrands = getSelectedFilters('brand');

        // For demonstration, show/hide products based on category
        // In a real application, this would filter based on actual product data
        showNotification('Filters applied', 'info');
    }

    function getSelectedFilters(type) {
        const prefix = type === 'category' ? 'cat' : 'brand';
        const checkboxes = document.querySelectorAll(`input[id^="${prefix}"]`);
        const selected = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.id);
            }
        });

        return selected;
    }

    // ============================================
    // SORT FUNCTIONALITY
    // ============================================

    function initializeEventListeners() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                sortProducts(this.value);
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleNewsletterSubscription(this);
            });
        }

        // View toggle buttons
        const viewButtons = document.querySelectorAll('.sort-section .btn-outline-secondary');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                toggleProductView(this);
            });
        });
    }

    function sortProducts(sortBy) {
        const productGrid = document.querySelector('.row.g-4');
        const products = Array.from(productGrid.querySelectorAll('.col-lg-6'));

        switch(sortBy) {
            case 'Price: Low to High':
                products.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('PKR ', ''));
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('PKR ', ''));
                    return priceA - priceB;
                });
                break;
            case 'Price: High to Low':
                products.sort((a, b) => {
                    const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('PKR ', ''));
                    const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('PKR ', ''));
                    return priceB - priceA;
                });
                break;
            case 'Newest':
                // Reverse order for newest
                products.reverse();
                break;
        }

        // Re-append sorted products
        products.forEach(product => {
            productGrid.appendChild(product);
        });

        showNotification(`Products sorted by ${sortBy}`, 'success');
    }

    function toggleProductView(button) {
        const isGridView = button.querySelector('i').classList.contains('fa-th');
        const productCards = document.querySelectorAll('.product-card');

        if (isGridView) {
            // Switch to list view
            productCards.forEach(card => {
                card.style.display = 'flex';
                card.style.flexDirection = 'row';
            });
            showNotification('Switched to list view', 'info');
        } else {
            // Switch to grid view
            productCards.forEach(card => {
                card.style.display = '';
                card.style.flexDirection = 'column';
            });
            showNotification('Switched to grid view', 'info');
        }
    }

    // ============================================
    // NEWSLETTER SUBSCRIPTION
    // ============================================

    function handleNewsletterSubscription(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email === '') {
            showNotification('Please enter your email address', 'warning');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }

        // Simulate subscription
        const button = form.querySelector('.btn-subscribe');
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Subscribing...';

        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
            showNotification('Thank you for subscribing!', 'success');
            emailInput.value = '';
        }, 1500);
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            font-size: 0.9rem;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        // Set background color based on type
        const colors = {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0891B2'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.style.color = 'white';

        // Add to document
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ============================================
    // ANIMATIONS
    // ============================================

    // Add animation styles to document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Format currency
    function formatCurrency(amount) {
        return 'PKR ' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // EXPORT FUNCTIONS (if needed for external use)
    // ============================================

    window.SereneCart = {
        getCart: () => cart,
        addToCart: addToCart,
        getTotal: () => cart.total,
        getItemCount: () => cart.items.length
    };

})();

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close modals or clear search
    if (e.key === 'Escape') {
        const searchInput = document.querySelector('.search-box input');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            searchInput.focus();
        }
    }

    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images (if needed)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ========================================
   ADVANCED MENU FILTERING SYSTEM
======================================== */

class MenuFilter {
  constructor() {
    this.init();
    this.currentFilter = 'all';
    this.searchTerm = '';
    this.priceRange = { min: 0, max: 100 };
    this.dietary = [];
  }

  init() {
    this.setupFilterButtons();
    this.setupSearch();
    this.setupPriceFilter();
    this.setupDietaryFilters();
    this.setupSorting();
  }

  setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        this.currentFilter = button.dataset.filter;
        this.filterItems();
      });
    });
  }

  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
      searchInput.addEventListener('input', RestaurantUtils.debounce((e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.filterItems();
      }, 300));
    }
  }

  setupPriceFilter() {
    const priceSlider = document.querySelector('#price-range');
    
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.priceRange.max = parseFloat(e.target.value);
        this.updatePriceDisplay();
        this.filterItems();
      });
    }
  }

  updatePriceDisplay() {
    const display = document.querySelector('.price-display');
    if (display) {
      display.textContent = `Up to ${RestaurantUtils.formatCurrency(this.priceRange.max)}`;
    }
  }

  setupDietaryFilters() {
    const dietaryCheckboxes = document.querySelectorAll('.dietary-filter');
    
    dietaryCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if (e.target.checked) {
          this.dietary.push(value);
        } else {
          this.dietary = this.dietary.filter(item => item !== value);
        }
        
        this.filterItems();
      });
    });
  }

  setupSorting() {
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortItems(e.target.value);
      });
    }
  }

  filterItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    let visibleCount = 0;
    
    menuItems.forEach(item => {
      const shouldShow = this.shouldShowItem(item);
      
      if (shouldShow) {
        item.style.display = 'block';
        item.style.animation = 'fadeIn 0.5s ease-in-out';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });
    
    this.updateResultsCount(visibleCount);
    this.updateNoResults(visibleCount === 0);
  }

  shouldShowItem(item) {
    const category = item.dataset.category;
    const title = item.querySelector('.menu-item-title').textContent.toLowerCase();
    const description = item.querySelector('.menu-item-description').textContent.toLowerCase();
    const price = parseFloat(item.querySelector('.menu-item-price').textContent.replace(/[^0-9.]/g, ''));
    const itemDietary = item.dataset.dietary ? item.dataset.dietary.split(',') : [];
    
    // Category filter
    if (this.currentFilter !== 'all' && category !== this.currentFilter) {
      return false;
    }
    
    // Search filter
    if (this.searchTerm && !title.includes(this.searchTerm) && !description.includes(this.searchTerm)) {
      return false;
    }
    
    // Price filter
    if (price > this.priceRange.max) {
      return false;
    }
    
    // Dietary filter
    if (this.dietary.length > 0) {
      const hasRequiredDietary = this.dietary.some(requirement => 
        itemDietary.includes(requirement)
      );
      if (!hasRequiredDietary) {
        return false;
      }
    }
    
    return true;
  }

  sortItems(sortBy) {
    const menuContainer = document.querySelector('.menu-grid');
    const items = Array.from(menuContainer.querySelectorAll('.menu-item'));
    
    items.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return this.getPrice(a) - this.getPrice(b);
        case 'price-high':
          return this.getPrice(b) - this.getPrice(a);
        case 'name':
          return this.getName(a).localeCompare(this.getName(b));
        case 'popular':
          return this.getPopularity(b) - this.getPopularity(a);
        default:
          return 0;
      }
    });
    
    // Re-append sorted items
    items.forEach(item => menuContainer.appendChild(item));
  }

  getPrice(item) {
    return parseFloat(item.querySelector('.menu-item-price').textContent.replace(/[^0-9.]/g, ''));
  }

  getName(item) {
    return item.querySelector('.menu-item-title').textContent;
  }

  getPopularity(item) {
    return parseInt(item.dataset.popularity || 0);
  }

  updateResultsCount(count) {
    const counter = document.querySelector('.results-count');
    if (counter) {
      counter.textContent = `${count} items found`;
    }
  }

  updateNoResults(show) {
    const noResults = document.querySelector('.no-results');
    if (noResults) {
      noResults.style.display = show ? 'block' : 'none';
    }
  }

  // Public methods for external use
  clearAllFilters() {
    this.currentFilter = 'all';
    this.searchTerm = '';
    this.dietary = [];
    
    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    document.querySelectorAll('.dietary-filter').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    this.filterItems();
  }

  getFilteredItems() {
    return Array.from(document.querySelectorAll('.menu-item'))
      .filter(item => item.style.display !== 'none');
  }
}

// Initialize menu filter when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.menu-page')) {
    window.menuFilter = new MenuFilter();
  }
});

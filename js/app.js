const categoryNav = document.getElementById('category-nav');
const menuGrid = document.getElementById('menu-grid');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const backToTopBtn = document.getElementById('back-to-top');

let activeCategory = "Tümü";
let searchQuery = "";

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Create Twinkling Stars
function createStars() {
  const container = document.getElementById('stars-container');
  if (!container) return;
  const starCount = 50;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Random size between 1px and 3px
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Random animation delay
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    
    container.appendChild(star);
  }
}

// Render Category Navigation
function renderCategories() {
  categoryNav.innerHTML = '';
  
  categories.forEach(category => {
    const btn = document.createElement('button');
    const isActive = category === activeCategory;
    
    btn.textContent = category;
    btn.className = `whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md shrink-0 ${
      isActive 
        ? 'bg-gradient-to-r from-mars_orange to-[#F09A5B] text-background shadow-[0_0_15px_rgba(200,107,60,0.4)] border border-transparent' 
        : 'bg-white/5 text-sand_beige hover:bg-white/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
    }`;
    
    btn.addEventListener('click', () => {
      activeCategory = category;
      renderCategories();
      renderMenu();
      
      // Scroll to top of menu smoothly if not reduced motion
      const menuHeader = document.querySelector('header');
      if (menuHeader) {
        menuHeader.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
    
    categoryNav.appendChild(btn);
  });
}

// Render Menu Items
function renderMenu() {
  menuGrid.innerHTML = '';
  
  const filteredItems = menuData.filter(item => {
    // 1. Category Match
    let matchesCategory = false;
    if (activeCategory === "Tümü") {
      matchesCategory = true;
    } else if (activeCategory === "Popüler") {
      matchesCategory = item.isPopular;
    } else {
      matchesCategory = item.category === activeCategory;
    }
    
    // 2. Search Match
    let matchesSearch = true;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const searchStr = `${item.name} ${item.description} ${item.category} ${item.tags.join(' ')}`.toLowerCase();
      matchesSearch = searchStr.includes(query);
    }
    
    return matchesCategory && matchesSearch;
  });
  
  // Empty State
  if (filteredItems.length === 0) {
    menuGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    emptyState.classList.add('flex');
  } else {
    menuGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');
    
    // Render Cards
    filteredItems.forEach((item, index) => {
      const card = document.createElement('article');
      // Calculate delay based on index for staggered animation, max out at 5 so it doesn't take forever
      const animDelay = prefersReducedMotion ? 0 : Math.min(index * 0.05, 0.5);
      
      // If not available, add a grayscale class
      const availabilityClass = item.available ? '' : 'grayscale-[80%] opacity-80';
      
      card.className = `relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col h-full menu-card-hover item-enter backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group ${availabilityClass}`;
      card.style.animationDelay = `${animDelay}s`;
      
      let glowColor = "rgba(255,255,255,0)";
      if (item.tags.includes("Sıcak") || item.tags.includes("Önerilen")) {
        glowColor = "rgba(200, 107, 60, 0.15)";
      } else if (item.tags.includes("Soğuk")) {
        glowColor = "rgba(131, 181, 209, 0.15)";
      }
      
      const glowHtml = `<div class="absolute -top-10 -right-10 w-40 h-40 rounded-full mix-blend-screen filter blur-[40px] pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:opacity-80" style="background-color: ${glowColor};"></div>`;
      
      // Image HTML (First in hierarchy now)
      const outOfStockOverlay = !item.available 
        ? `<div class="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm z-20">
             <span class="px-3 py-1 bg-dusty_red text-white text-xs font-bold rounded uppercase tracking-wider shadow-lg">Tükendi</span>
           </div>`
        : '';

      const imageHtml = item.image 
        ? `<div class="relative w-full h-40 mb-4 rounded-xl overflow-hidden shadow-lg border border-white/5 shrink-0">
             ${outOfStockOverlay}
             <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
           </div>`
        : '';
        
      // Tags HTML
      const tagsHtml = item.tags.map(tag => {
        let bgColor = "bg-white/5";
        let textColor = "text-muted_text";
        
        if (tag === "Sıcak") {
          textColor = "text-dusty_red";
        } else if (tag === "Soğuk") {
          textColor = "text-[#83B5D1]";
        } else if (tag === "Önerilen") {
          textColor = "text-mars_orange";
          bgColor = "bg-mars_orange/10";
        }
        
        return `<span class="text-[10px] px-2 py-0.5 rounded ${bgColor} ${textColor} border border-white/5 font-medium tracking-wide uppercase">${tag}</span>`;
      }).join('');
      
      // Allergens HTML
      const allergensHtml = item.allergens.length > 0
        ? `<div class="mt-2 text-[10px] text-dusty_red/80 flex items-center gap-1 font-medium">
            <i data-lucide="alert-circle" class="w-3 h-3"></i>
            <span>${item.allergens.join(', ')}</span>
           </div>`
        : '';

      // Sizes HTML (Optional)
      const sizesHtml = item.sizes && item.sizes.length > 0
        ? `<div class="text-[10px] text-muted_text mt-1 flex items-center gap-2">
            <span>Boyutlar:</span>
            <span class="font-medium text-cream_text">${item.sizes.join(', ')}</span>
           </div>`
        : '';

      card.innerHTML = `
        ${glowHtml}
        <div class="flex flex-col h-full relative z-10">
          ${imageHtml}
          <div class="flex-grow">
            <h3 class="text-lg font-heading font-semibold text-cream_text leading-tight mb-1">${item.name}</h3>
            <p class="text-xs text-muted_text mb-3 leading-relaxed">${item.description}</p>
            <div class="flex flex-wrap gap-1.5 mb-2">
              ${tagsHtml}
            </div>
            ${sizesHtml}
            ${allergensHtml}
          </div>
          <div class="mt-4 pt-3 border-t border-white/5 flex justify-end items-end shrink-0">
            <span class="text-xl font-bold text-sand_beige drop-shadow-sm">${item.price} ₺</span>
          </div>
        </div>
      `;
      
      // 3D Tilt Effect on Hover (Only if available)
      if (item.available) {
        card.addEventListener('mouseenter', () => {
          if (prefersReducedMotion) return;
          card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
          if (prefersReducedMotion) return;
          
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;
          
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
          if (prefersReducedMotion) return;
          card.style.transition = 'transform 0.5s ease-out';
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          
          setTimeout(() => {
            card.style.transition = '';
            card.style.transform = '';
          }, 500);
        });
      }
      
      menuGrid.appendChild(card);
    });
    
    // Re-initialize icons for newly added HTML
    lucide.createIcons();
  }
}

// Search Input Listener
searchInput?.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderMenu();
});

// Compact Header on Scroll
const stickyHeader = document.getElementById('sticky-header');
const stickyIsland = document.getElementById('sticky-island');
const searchContainer = document.getElementById('search-container');
const compactSearchBtn = document.getElementById('compact-search-btn');

if (stickyHeader && stickyIsland) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      // Compact state
      stickyIsland.classList.replace('p-3', 'p-1.5');
      stickyIsland.classList.replace('rounded-3xl', 'rounded-full');
      searchContainer.classList.add('hidden');
      compactSearchBtn.classList.remove('hidden');
    } else {
      // Expanded state
      stickyIsland.classList.replace('p-1.5', 'p-3');
      stickyIsland.classList.replace('rounded-full', 'rounded-3xl');
      searchContainer.classList.remove('hidden');
      compactSearchBtn.classList.add('hidden');
    }
  }, { passive: true });

  compactSearchBtn?.addEventListener('click', () => {
    searchContainer.classList.remove('hidden');
    compactSearchBtn.classList.add('hidden');
    document.getElementById('search-input')?.focus();
  });
}

// Back to Top functionality
window.addEventListener('scroll', () => {
  if (!backToTopBtn) return;
  if (window.scrollY > 300) {
    backToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    backToTopBtn.classList.add('opacity-100', 'translate-y-0');
  } else {
    backToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
  }
}, { passive: true });

backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth'
  });
});

// Parallax Background Effect
const parallaxBg = document.getElementById('parallax-bg');

function handleParallax(e) {
  if (prefersReducedMotion || !parallaxBg) return;
  
  let clientX, clientY;
  
  if (e.type === 'touchmove') {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Inverse movement for depth effect (moves opposite to cursor)
  // Max 40px translation in any direction
  const moveX = ((clientX / windowWidth) - 0.5) * -60;
  const moveY = ((clientY / windowHeight) - 0.5) * -60;
  
  // Use translate3d for hardware acceleration
  parallaxBg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
}

window.addEventListener('mousemove', handleParallax, { passive: true });
window.addEventListener('touchmove', handleParallax, { passive: true });

// Init
function init() {
  createStars();
  renderCategories();
  renderMenu();
}

// Run init on DOMContentLoaded with Error Handling
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (typeof menuData === 'undefined' || !Array.isArray(menuData)) {
      throw new Error('Menu data is missing or invalid.');
    }
    if (typeof categories === 'undefined' || !Array.isArray(categories)) {
      throw new Error('Category data is missing or invalid.');
    }
    
    lucide.createIcons();
    init();
  } catch (error) {
    console.error('Failed to initialize menu:', error);
    
    // Show error state
    const errState = document.getElementById('error-state');
    if (errState) errState.classList.remove('hidden');
    if (errState) errState.classList.add('flex');
    
    // Hide UI
    if (menuGrid) menuGrid.classList.add('hidden');
    if (categoryNav) categoryNav.parentElement.classList.add('hidden');
    
    lucide.createIcons();
  }
});

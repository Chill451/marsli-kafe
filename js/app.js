// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const categoryNav = document.getElementById('category-nav');
const menuGrid = document.getElementById('menu-grid');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const starsContainer = document.getElementById('stars-container');
const backToTopBtn = document.getElementById('back-to-top');

// State
let activeCategory = "Tümü";
let searchQuery = "";
let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Generate Twinkling Stars
function createStars() {
  if (prefersReducedMotion) return; // Skip if user prefers reduced motion
  
  const numStars = 30;
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    
    // Random size (1px to 3px)
    const size = Math.random() * 2 + 1;
    
    // Random animation duration and delay
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;
    
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    
    starsContainer.appendChild(star);
  }
}

// Render Category Tabs
function renderCategories() {
  categoryNav.innerHTML = '';
  
  categories.forEach(category => {
    const btn = document.createElement('button');
    const isActive = category === activeCategory;
    
    btn.className = `whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md ${
      isActive 
        ? 'bg-gradient-to-r from-mars_orange to-[#F09A5B] text-background shadow-[0_0_15px_rgba(200,107,60,0.4)] border border-transparent' 
        : 'bg-white/5 text-sand_beige hover:bg-white/10 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
    }`;
    btn.textContent = category;
    
    btn.addEventListener('click', () => {
      activeCategory = category;
      renderCategories(); // Re-render to update active styling
      renderMenu();
      
      // Scroll to category tabs if they are out of view (optional enhancement)
      // categoryNav.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    
    categoryNav.appendChild(btn);
  });
}

// Render Menu Items
function renderMenu() {
  // Clear grid
  menuGrid.innerHTML = '';
  
  // Filter logic
  const filteredItems = menuData.filter(item => {
    // 1. Availability
    if (!item.available) return false;
    
    // 2. Category Match
    let matchesCategory = false;
    if (activeCategory === "Tümü") {
      matchesCategory = true;
    } else if (activeCategory === "Popüler") {
      matchesCategory = item.isPopular;
    } else {
      matchesCategory = item.category === activeCategory;
    }
    
    // 3. Search Match
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
      
      card.className = `relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col h-full menu-card-hover item-enter backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 group`;
      card.style.animationDelay = `${animDelay}s`;
      
      let glowColor = "rgba(255,255,255,0)";
      if (item.tags.includes("Sıcak") || item.tags.includes("Önerilen")) {
        glowColor = "rgba(200, 107, 60, 0.15)";
      } else if (item.tags.includes("Soğuk")) {
        glowColor = "rgba(131, 181, 209, 0.15)";
      }
      
      const glowHtml = `<div class="absolute -top-10 -right-10 w-40 h-40 rounded-full mix-blend-screen filter blur-[40px] pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:opacity-80" style="background-color: ${glowColor};"></div>`;
      
      // Popular badge HTML
      const popularBadge = item.isPopular 
        ? `<span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 mb-2">
            <i data-lucide="star" class="w-3 h-3 fill-accent"></i> Popüler
           </span>`
        : '';
        
      // Tags HTML
      const tagsHtml = item.tags.map(tag => {
        let bgColor = "bg-card";
        let textColor = "text-muted_text";
        
        if (tag === "Sıcak") {
          textColor = "text-dusty_red";
        } else if (tag === "Soğuk") {
          textColor = "text-[#83B5D1]"; // Soft ice blue inline color for cold tag
        } else if (tag === "Önerilen") {
          textColor = "text-mars_orange";
        }
        
        return `<span class="text-xs px-2 py-1 rounded-md ${bgColor} ${textColor} border border-white/5">${tag}</span>`;
      }).join('');
      
      // Allergens HTML
      const allergensHtml = item.allergens.length > 0
        ? `<div class="mt-3 pt-3 border-t border-card/50 flex items-start gap-1.5 text-[10px] text-muted_text/70">
            <i data-lucide="info" class="w-3 h-3 shrink-0"></i>
            <span>${item.allergens.join(', ')}</span>
           </div>`
        : '';

      card.innerHTML = `
        ${glowHtml}
        <div class="flex-grow relative z-10">
          ${popularBadge}
          <div class="flex justify-between items-start gap-2 mb-2">
            <h3 class="text-base font-heading font-semibold text-cream_text">${item.name}</h3>
            <span class="text-lg font-bold text-sand_beige whitespace-nowrap">${item.price} ₺</span>
          </div>
          <p class="text-sm text-muted_text mb-4 leading-relaxed">${item.description}</p>
        </div>
        <div class="flex flex-wrap gap-1.5 mt-auto relative z-10">
          ${tagsHtml}
        </div>
        ${allergensHtml ? `<div class="relative z-10">${allergensHtml}</div>` : ''}
      `;
      // 3D Tilt Effect on Hover
      card.addEventListener('mouseenter', () => {
        if (prefersReducedMotion) return;
        // Remove transition duration during mousemove so it doesn't lag/freeze
        card.style.transitionDuration = '0ms';
      });

      card.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt angles (max 10 degrees)
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Apply transform instantly (transition is 0ms)
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-4px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        if (prefersReducedMotion) return;
        // Restore transition duration for a smooth return
        card.style.transitionDuration = '300ms';
        // Reset transform to allow CSS hover effects to take over again
        card.style.transform = '';
      });
      
      menuGrid.appendChild(card);
    });
    
    // Re-initialize icons for newly added HTML
    lucide.createIcons();
  }
}

// Search Input Listener
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderMenu();
});

// Back to Top functionality
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    backToTopBtn.classList.add('opacity-100', 'translate-y-0');
  } else {
    backToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
  }
});

backToTopBtn.addEventListener('click', () => {
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
  const moveX = ((clientX / windowWidth) - 0.5) * -80;
  const moveY = ((clientY / windowHeight) - 0.5) * -80;
  
  parallaxBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

window.addEventListener('mousemove', handleParallax);
window.addEventListener('touchmove', handleParallax, { passive: true });

// Init
function init() {
  createStars();
  renderCategories();
  renderMenu();
}

// Run init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);

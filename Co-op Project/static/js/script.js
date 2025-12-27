// ============================================
// Sound System - SIMPLIFIED (Không có toggle button)
// ============================================
const sounds = {
  success: new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'),
  error: new Audio('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3')
};

// Set volume
sounds.success.volume = 0.5;
sounds.error.volume = 0.4;

// Preload
sounds.success.preload = 'auto';
sounds.error.preload = 'auto';

// Helper function
function playSound(type) {
  if (sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play().catch(e => console.log('Audio playback failed:', e));
  }
}

// ============================================
// Theme Switcher
// ============================================
const themeToggle = document.createElement('div');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = `
  <i class="fas fa-sun"></i>
  <i class="fas fa-moon"></i>
`;
document.body.appendChild(themeToggle);

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  themeToggle.style.transition = 'transform 0.3s ease';
  themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1) rotate(0deg)';
  }, 300);
});

// ============================================
// Performance Functions
// ============================================
function debounce(func, wait = 15) {
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

function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ============================================
// Loading Screen
// ============================================
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const minLoadTime = 800;
  const startTime = performance.now();
  
  function hideLoader() {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, minLoadTime - elapsed);
    
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.pointerEvents = 'auto';
      document.body.classList.add('loaded');
    }, remaining);
  }
  
  document.body.style.pointerEvents = 'none';
  hideLoader();
});

// ============================================
// Scroll Progress Bar
// ============================================
const updateScrollProgress = throttle(() => {
  const scrollProgress = document.getElementById('scrollProgress');
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.pageYOffset / windowHeight);
  
  requestAnimationFrame(() => {
    scrollProgress.style.transform = `scaleX(${scrolled})`;
  });
}, 50);

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ============================================
// Header Scroll Effect
// ============================================
let lastScrollY = 0;
let ticking = false;

const updateHeader = () => {
  const header = document.getElementById('header');
  const scrollY = window.pageYOffset;
  
  if (scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollY = scrollY;
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
}, { passive: true });

// ============================================
// Mobile Menu
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.setAttribute('aria-label', 'Toggle navigation menu');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.setAttribute('role', 'button');

hamburger.addEventListener('click', () => {
  const isActive = hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isActive);
  document.body.style.overflow = isActive ? 'hidden' : '';
  
  if (isActive) {
    mobileMenu.querySelector('a')?.focus();
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
    hamburger.click();
  }
});

document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('active') && 
      !mobileMenu.contains(e.target) && 
      !hamburger.contains(e.target)) {
    hamburger.click();
  }
});

// ============================================
// Smooth Scroll
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#!') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerHeight = document.getElementById('header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      history.pushState(null, '', href);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

// ============================================
// Scroll to Top Button
// ============================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
  scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
  
  const toggleScrollButton = throttle(() => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }, 100);
  
  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    document.querySelector('h1')?.focus({ preventScroll: true });
  });
}

// ============================================
// Stats Counter Animation
// ============================================
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2500;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;
  
  const easeOutQuad = t => t * (2 - t);
  
  const updateCounter = () => {
    frame++;
    const progress = easeOutQuad(frame / totalFrames);
    const current = Math.round(target * progress);
    
    element.textContent = current;
    
    if (frame < totalFrames) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// ============================================
// Intersection Observer
// ============================================
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px',
  threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      if (entry.target.querySelector('.stat-number') && 
          !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      }
      
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(element => {
  revealObserver.observe(element);
});

// ============================================
// Drag & Drop Waste Classifier - VỚI ÂM THANH LỖI
// ============================================
const wasteItems = document.querySelectorAll('.waste-item');
const wasteBins = document.querySelectorAll('.waste-bin');
const demoResult = document.getElementById('demoResult');
let draggedItem = null;

wasteItems.forEach(item => {
  item.addEventListener('dragstart', (e) => {
    draggedItem = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
  });

  item.addEventListener('dragend', (e) => {
    e.target.style.opacity = '1';
  });
  
  item.addEventListener('touchstart', (e) => {
    draggedItem = e.target;
    e.target.style.opacity = '0.5';
  }, { passive: true });
  
  item.addEventListener('touchend', (e) => {
    e.target.style.opacity = '1';
  });
  
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `Drag ${item.textContent} to correct bin`);
});

wasteBins.forEach(bin => {
  bin.addEventListener('dragover', (e) => {
    e.preventDefault();
    bin.classList.add('drag-over');
  });

  bin.addEventListener('dragleave', () => {
    bin.classList.remove('drag-over');
  });

  bin.addEventListener('drop', (e) => {
    e.preventDefault();
    bin.classList.remove('drag-over');
    
    if (!draggedItem) return;
    
    const itemType = draggedItem.getAttribute('data-type');
    const binType = bin.getAttribute('data-bin');
    
    if (itemType === binType) {
      // ✅ ĐÚNG - Phát âm thanh thành công
      const icon = draggedItem.textContent;
      draggedItem.remove();
      
      demoResult.textContent = '✅ Chính xác! Bạn đã phân loại đúng!';
      demoResult.style.color = 'var(--green)';
      demoResult.setAttribute('role', 'status');
      demoResult.setAttribute('aria-live', 'polite');
      
      bin.querySelector('.waste-bin-icon').textContent += icon;
      createParticles(bin);
      
      // 🔊 PHÁT ÂM THANH THÀNH CÔNG
      playSound('success');
      
    } else {
      // ❌ SAI - Phát âm thanh lỗi
      demoResult.textContent = '❌ Chưa đúng, hãy thử lại!';
      demoResult.style.color = '#EF4444';
      demoResult.setAttribute('role', 'alert');
      
      draggedItem.style.animation = 'shake 0.5s';
      setTimeout(() => {
        draggedItem.style.animation = '';
      }, 500);
      
      // 🔊 PHÁT ÂM THANH LỖI
      playSound('error');
    }
    
    setTimeout(() => {
      demoResult.textContent = '';
    }, 3000);
    
    draggedItem = null;
  });
});

// ============================================
// Particle Effect
// ============================================
function createParticles(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const particleCount = 30;
  const colors = ['#5865F2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 4 + Math.random() * 8;
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${centerX}px;
      top: ${centerY}px;
      box-shadow: 0 0 10px ${color};
    `;
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 2 + Math.random() * 4;
    const gravity = 0.15;
    let x = centerX;
    let y = centerY;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;
    let opacity = 1;
    
    const animate = () => {
      x += vx;
      y += vy;
      vy += gravity;
      opacity -= 0.015;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.opacity = opacity;
      particle.style.transform = `scale(${opacity})`;
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// ============================================
// Testimonials Slider
// ============================================
const testimonialTrack = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let autoSlideInterval;

function updateSlider(index, smooth = true) {
  const cards = testimonialTrack.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;
  
  const slideWidth = cards[0].offsetWidth + 36;
  
  testimonialTrack.style.transition = smooth ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
  testimonialTrack.style.transform = `translateX(-${index * slideWidth}px)`;
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
    dot.setAttribute('aria-current', i === index ? 'true' : 'false');
  });
}

dots.forEach((dot, index) => {
  dot.setAttribute('role', 'button');
  dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
  dot.setAttribute('tabindex', '0');
  
  dot.addEventListener('click', () => {
    currentSlide = index;
    updateSlider(currentSlide);
    resetAutoSlide();
  });
  
  dot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dot.click();
    }
  });
});

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % dots.length;
    updateSlider(currentSlide);
  }, 6000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

testimonialTrack.addEventListener('mouseenter', () => {
  clearInterval(autoSlideInterval);
});

testimonialTrack.addEventListener('mouseleave', () => {
  startAutoSlide();
});

let touchStartX = 0;
let touchEndX = 0;

testimonialTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

testimonialTrack.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  
  if (touchEndX < touchStartX - swipeThreshold) {
    currentSlide = (currentSlide + 1) % dots.length;
  } else if (touchEndX > touchStartX + swipeThreshold) {
    currentSlide = (currentSlide - 1 + dots.length) % dots.length;
  } else {
    return;
  }
  
  updateSlider(currentSlide);
  resetAutoSlide();
}

startAutoSlide();

window.addEventListener('resize', debounce(() => {
  updateSlider(currentSlide, false);
}, 300));

// ============================================
// Accessibility - Prefers Reduced Motion
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.documentElement.style.setProperty('--transition-fast', '0.01ms');
  document.documentElement.style.setProperty('--transition-base', '0.01ms');
  document.documentElement.style.setProperty('--transition-smooth', '0.01ms');
  clearInterval(autoSlideInterval);
}

// ============================================
// Console Easter Egg
// ============================================
const consoleStyles = {
  title: 'color: #10B981; font-size: 32px; font-weight: 900; text-shadow: 2px 2px 4px rgba(16, 185, 129, 0.3);',
  subtitle: 'color: #5865F2; font-size: 18px; font-weight: 600;',
  info: 'color: #6B7280; font-size: 14px;',
  link: 'color: #F59E0B; font-size: 14px; font-weight: 600;'
};

console.log('%c🌿 Green Spring Project', consoleStyles.title);
console.log('%cNước thượng nguồn trong - Thành phố sạch bền vững', consoleStyles.subtitle);
console.log('%cĐược phát triển bởi Đại học Đà Lạt x Hallym University', consoleStyles.info);
console.log('%c✨ Phiên bản cải tiến với Light/Dark Mode & Accessibility', consoleStyles.link);
console.log('%c💻 Interested in contributing? Check our GitHub!', consoleStyles.link);

// ============================================
// Performance Monitoring (Dev Mode)
// ============================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('%c📊 Performance Metrics:', 'color: #8B5CF6; font-weight: bold;');
      console.table({
        'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
        'Page Load Time': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
        'Total Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`
      });
    }, 0);
  });
}

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (e) => {
  console.error('Global error caught:', e.error);
});

// ============================================
// Charts với Chart.js
// ============================================
if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
  
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const isDark = currentTheme === 'dark';
  
  const chartColors = {
    blurple: '#5865F2',
    green: '#10B981',
    accent: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textColor: isDark ? '#D1D5DB' : '#4B5563'
  };
  
  // Pie Chart
  const pieCtx = document.getElementById('wasteDistributionChart');
  if (pieCtx) {
    new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Tái chế', 'Hữu cơ', 'Còn lại', 'Nguy hại'],
        datasets: [{
          label: 'Kg',
          data: [450, 380, 320, 84],
          backgroundColor: [
            chartColors.blurple,
            chartColors.green,
            chartColors.accent,
            chartColors.red
          ],
          borderColor: isDark ? '#1F2937' : '#FFFFFF',
          borderWidth: 3,
          hoverOffset: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: { size: 14, weight: '600' },
              color: chartColors.textColor,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            titleColor: chartColors.textColor,
            bodyColor: chartColors.textColor,
            borderColor: chartColors.blurple,
            borderWidth: 2,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} kg (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    });
  }
  
  // Column Chart
  const columnCtx = document.getElementById('monthlyStatsChart');
  if (columnCtx) {
    new Chart(columnCtx, {
      type: 'bar',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
        datasets: [
          {
            label: 'Tái chế',
            data: [65, 75, 82, 90, 95, 103],
            backgroundColor: chartColors.blurple,
            borderRadius: 8,
            borderSkipped: false
          },
          {
            label: 'Hữu cơ',
            data: [55, 62, 68, 73, 78, 84],
            backgroundColor: chartColors.green,
            borderRadius: 8,
            borderSkipped: false
          },
          {
            label: 'Còn lại',
            data: [40, 45, 48, 52, 55, 60],
            backgroundColor: chartColors.accent,
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: chartColors.textColor,
              font: { size: 13, weight: '600' }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: chartColors.gridColor,
              drawBorder: false
            },
            ticks: {
              color: chartColors.textColor,
              callback: function(value) {
                return value + ' kg';
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: { size: 14, weight: '600' },
              color: chartColors.textColor,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            titleColor: chartColors.textColor,
            bodyColor: chartColors.textColor,
            borderColor: chartColors.blurple,
            borderWidth: 2,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y} kg`;
              }
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    });
  }
  
  // Update charts khi đổi theme
  const themeToggleBtn = document.querySelector('.theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTimeout(() => {
        location.reload();
      }, 350);
    });
  }
  
} else {
  console.warn('Chart.js chưa được load!');
}

// ============================================
// Cleanup on Page Unload
// ============================================
window.addEventListener('beforeunload', () => {
  clearInterval(autoSlideInterval);
  revealObserver.disconnect();
  
  if (typeof Chart !== 'undefined') {
    Chart.helpers.each(Chart.instances, function(instance) {
      instance.destroy();
    });
  }
  
  Object.values(sounds).forEach(sound => {
    sound.pause();
    sound.src = '';
  });
});

// ============================================
// ADMIN DASHBOARD JAVASCRIPT - GREEN SPRING
// Complete Version with All Features
// ============================================

// ===== CONFIGURATION =====
const CONFIG = {
  REFRESH_INTERVAL: 30000, // 30 seconds
  ANIMATION_DURATION: 2000,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000
};

// ===== MOCK DATA CONFIGURATION =====
const MOCK_DATA = {
  kpi: {
    users: { current: 1847, growth: 12.3, newThisWeek: 156, trend: 'up' },
    waste: { current: 3542, growth: 8.5, thisWeek: 478, trend: 'up' },
    points: { current: 89456, growth: 15.2, redeemed: 2340, trend: 'up' },
    aiScans: { current: 12845, growth: 24.7, accuracy: 94.2, trend: 'up' }
  },
  
  wasteDistribution: {
    labels: ['Tái chế', 'Hữu cơ', 'Nguy hại', 'Còn lại'],
    data: [1488, 1239, 283, 531],
    colors: ['#5865F2', '#10B981', '#EF4444', '#F59E0B']
  },
  
  monthlyTrend: {
    labels: ['Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    users: [145, 189, 234, 312, 398, 567],
    waste: [234, 298, 345, 412, 489, 542]
  },
  
  collectionPoints: {
    labels: ['ĐH Đà Lạt', 'THPT Yersin', 'Chợ Đà Lạt', 'KTX B', 'Hồ Xuân Hương'],
    data: [567, 342, 289, 245, 198]
  },
  
  aiAccuracy: {
    categories: [
      { name: 'Tái chế', value: 96.8, samples: 12458, icon: 'recycle', color: '#5865F2' },
      { name: 'Hữu cơ', value: 93.4, samples: 8234, icon: 'leaf', color: '#10B981' },
      { name: 'Nguy hại', value: 98.1, samples: 1892, icon: 'skull-crossbones', color: '#EF4444' },
      { name: 'Còn lại', value: 89.5, samples: 3567, icon: 'trash', color: '#F59E0B' }
    ],
    trend: Array.from({length: 30}, (_, i) => ({
      day: i + 1,
      accuracy: 88 + Math.random() * 10 + (i * 0.1)
    }))
  },
  
  activities: [
    { user: 'Nguyễn Thị Mai', action: 'scan', item: 'Chai nhựa PET', points: 15, time: '2 phút', avatar: 44 },
    { user: 'Trần Văn Nam', action: 'collect', item: '5.2 kg rác tái chế', points: 52, time: '15 phút', avatar: 32 },
    { user: 'Lê Thu Hà', action: 'reward', item: 'Túi vải canvas', points: -500, time: '1 giờ', avatar: 68 },
    { user: 'Phạm Minh Tuấn', action: 'achievement', item: 'Eco Warrior', badge: '🏆', time: '3 giờ', avatar: 52 },
    { user: 'Hoàng Lan Anh', action: 'scan', item: 'Lon nhôm', points: 10, time: '5 giờ', avatar: 28 }
  ],
  
  leaderboard: [
    { rank: 1, name: 'Nguyễn Văn A', weight: 45.8, points: 1247, trend: 3, avatar: 45 },
    { rank: 2, name: 'Trần Thị B', weight: 42.3, points: 1156, trend: -1, avatar: 65 },
    { rank: 3, name: 'Lê Văn C', weight: 38.9, points: 1089, trend: 2, avatar: 75 },
    { rank: 4, name: 'Phạm Thu D', weight: 35.2, points: 945, trend: 0, avatar: 44 },
    { rank: 5, name: 'Hoàng Minh E', weight: 32.7, points: 892, trend: 1, avatar: 32 }
  ],
  
  heatmapData: [
    { day: 'Thứ 2', hours: [45, 78, 92, 120, 156, 134] },
    { day: 'Thứ 3', hours: [52, 89, 105, 142, 178, 121] },
    { day: 'Thứ 4', hours: [48, 95, 112, 138, 165, 115] },
    { day: 'Thứ 5', hours: [61, 102, 128, 155, 189, 142] },
    { day: 'Thứ 6', hours: [58, 98, 118, 148, 172, 138] },
    { day: 'Thứ 7', hours: [72, 115, 145, 178, 205, 168] },
    { day: 'CN', hours: [68, 108, 138, 165, 192, 158] }
  ]
};

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format number with thousand separators
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate random number in range
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('admin-theme') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('admin-theme', newTheme);
    
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
    
    showToast(`Đã chuyển sang chế độ ${newTheme === 'dark' ? 'tối' : 'sáng'}`, 'success');
  });
}

// ===== SIDEBAR TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    sidebar?.classList.toggle('active');
  });
}

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar?.classList.toggle('active');
  });
}

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 1024 && sidebar) {
    if (!sidebar.contains(e.target) && 
        !mobileToggle?.contains(e.target) && 
        sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  }
});

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = CONFIG.ANIMATION_DURATION) {
  const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
  const increment = (target - start) / (duration / 16);
  let current = start;
  
  const updateCounter = () => {
    current += increment;
    if ((increment > 0 && current < target) || (increment < 0 && current > target)) {
      element.textContent = formatNumber(Math.floor(current));
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = formatNumber(target);
    }
  };
  
  updateCounter();
}

// Initialize counters on page load
function initializeCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    animateCounter(counter, target);
  });
}

// ===== MOCK DATA SIMULATION =====
function simulateRealtimeData() {
  // Update AI Scans counter
  const scanCounter = document.querySelector('[data-target="12845"]');
  if (scanCounter) {
    const currentValue = parseInt(scanCounter.getAttribute('data-target'));
    const newValue = currentValue + randomInRange(5, 25);
    scanCounter.setAttribute('data-target', newValue);
    animateCounter(scanCounter, newValue, 1000);
  }
  
  // Update user counter
  const userCounter = document.querySelector('[data-target="1847"]');
  if (userCounter) {
    const currentValue = parseInt(userCounter.getAttribute('data-target'));
    if (Math.random() > 0.7) { // 30% chance of new user
      const newValue = currentValue + 1;
      userCounter.setAttribute('data-target', newValue);
      animateCounter(userCounter, newValue, 800);
    }
  }
  
  // Update growth badges
  const badges = document.querySelectorAll('.badge-success');
  badges.forEach(badge => {
    const currentText = badge.textContent;
    const match = currentText.match(/[\+\-](\d+\.\d+)%/);
    if (match) {
      const currentValue = parseFloat(match[1]);
      const change = (Math.random() - 0.5) * 0.3;
      const newValue = Math.max(0, currentValue + change).toFixed(1);
      badge.innerHTML = `<i class="fas fa-arrow-up"></i> +${newValue}%`;
    }
  });
  
  console.log('📊 Simulated data update at', new Date().toLocaleTimeString());
}

// ===== SEARCH FUNCTIONALITY =====
const userSearch = document.getElementById('userSearch');
if (userSearch) {
  userSearch.addEventListener('input', debounce(function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.data-table tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const isVisible = text.includes(searchTerm);
      row.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });
    
    // Show result count
    const resultInfo = document.getElementById('searchResultInfo');
    if (resultInfo) {
      resultInfo.textContent = `Hiển thị ${visibleCount} / ${rows.length} kết quả`;
    }
  }, CONFIG.DEBOUNCE_DELAY));
}

// ===== TABLE SELECT ALL =====
const selectAllCheckbox = document.getElementById('selectAll');
if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.data-table tbody input[type="checkbox"]');
    const checkedCount = this.checked ? checkboxes.length : 0;
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
    });
    
    updateBulkActionBar(checkedCount);
  });
}

// Update bulk action bar
function updateBulkActionBar(count) {
  const bulkBar = document.getElementById('bulkActionBar');
  if (bulkBar) {
    if (count > 0) {
      bulkBar.style.display = 'flex';
      bulkBar.querySelector('.selected-count').textContent = `Đã chọn ${count} mục`;
    } else {
      bulkBar.style.display = 'none';
    }
  }
}

// ===== FILTER TABS =====
const filterTabs = document.querySelectorAll('.tab-btn, .tab, .btn-timeline');
filterTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    const parentGroup = this.closest('.tab-group, .timeline-controls');
    if (parentGroup) {
      parentGroup.querySelectorAll('.tab-btn, .tab, .btn-timeline').forEach(t => {
        t.classList.remove('active');
      });
    }
    this.classList.add('active');
    
    const filterValue = this.getAttribute('data-period') || this.getAttribute('data-tab');
    console.log('Filter applied:', filterValue);
    
    // Update charts based on filter
    updateChartsWithPeriod(filterValue);
  });
});

// Update charts based on selected period
function updateChartsWithPeriod(period) {
  // This would fetch new data based on period in production
  showToast(`Đã lọc dữ liệu theo: ${period}`, 'info');
}

// ===== MODAL SYSTEM =====
function openModal(modalId) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${getModalTitle(modalId)}</h3>
        <button class="modal-close" onclick="closeModal(this)">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${getModalContent(modalId)}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden'; // Prevent background scroll
  
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal(modal.querySelector('.modal-close'));
    }
  });
}

function closeModal(btn) {
  const modal = btn.closest('.modal-overlay');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = ''; // Restore scroll
    }, 300);
  }
}

function getModalTitle(modalId) {
  const titles = {
    'addRewardModal': 'Thêm phần thưởng mới',
    'addBadgeModal': 'Tạo huy hiệu mới',
    'createCampaignModal': 'Tạo chiến dịch mới',
    'addPointModal': 'Thêm điểm thu gom',
    'addUserModal': 'Thêm người dùng mới'
  };
  return titles[modalId] || 'Modal';
}

function getModalContent(modalId) {
  return `
    <form class="modal-form" onsubmit="handleModalSubmit(event, '${modalId}')">
      <div class="form-group">
        <label>Tên <span class="required">*</span></label>
        <input type="text" class="form-control" name="name" required placeholder="Nhập tên...">
      </div>
      <div class="form-group">
        <label>Mô tả</label>
        <textarea class="form-control" name="description" rows="3" placeholder="Nhập mô tả chi tiết..."></textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="closeModal(this)">
          <i class="fas fa-times"></i> Hủy
        </button>
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-check"></i> Lưu
        </button>
      </div>
    </form>
  `;
}

function handleModalSubmit(event, modalId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  console.log('Form submitted:', modalId, data);
  showToast('Đã lưu thành công!', 'success');
  
  closeModal(event.target.querySelector('.modal-close'));
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.success};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    min-width: 280px;
    max-width: 400px;
  `;
  
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.success}"></i>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; margin-left: 8px;">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
  }, CONFIG.TOAST_DURATION);
}

// ===== EXPORT FUNCTIONS =====
document.querySelectorAll('[data-export]').forEach(btn => {
  btn.addEventListener('click', function() {
    const format = this.getAttribute('data-export');
    exportData(format);
  });
});

function exportData(format = 'pdf') {
  showToast(`Đang chuẩn bị file ${format.toUpperCase()}...`, 'info');
  
  const reportData = {
    timestamp: new Date().toISOString(),
    kpi: MOCK_DATA.kpi,
    wasteTotal: MOCK_DATA.wasteDistribution.data.reduce((a, b) => a + b, 0),
    userCount: MOCK_DATA.kpi.users.current,
    dateRange: {
      start: document.getElementById('startDate')?.value || 'N/A',
      end: document.getElementById('endDate')?.value || 'N/A'
    }
  };
  
  console.log('📥 Export data:', reportData);
  
  setTimeout(() => {
    if (format === 'pdf') {
      generatePDFReport(reportData);
    } else if (format === 'excel') {
      generateExcelReport(reportData);
    } else if (format === 'csv') {
      generateCSVReport(reportData);
    }
    
    showToast(`✅ Đã xuất file ${format.toUpperCase()} thành công!`, 'success');
  }, 1500);
}

function generatePDFReport(data) {
  const filename = `greenspring_report_${Date.now()}.pdf`;
  console.log(`📄 Generated ${filename}`, data);
  // In production: Use jsPDF or call backend API
  // window.open('/api/reports/pdf?data=' + encodeURIComponent(JSON.stringify(data)));
}

function generateExcelReport(data) {
  const filename = `greenspring_report_${Date.now()}.xlsx`;
  console.log(`📊 Generated ${filename}`, data);
  // In production: Use SheetJS or call backend API
}

function generateCSVReport(data) {
  let csv = 'Metric,Value\n';
  csv += `Total Users,${data.kpi.users.current}\n`;
  csv += `Total Waste (kg),${data.wasteTotal}\n`;
  csv += `AI Scans,${data.kpi.aiScans.current}\n`;
  csv += `Points,${data.kpi.points.current}\n`;
  csv += `Report Date,${new Date().toLocaleString('vi-VN')}\n`;
  
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `greenspring_report_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  console.log('📑 CSV exported successfully');
}

// ===== CHARTS INITIALIZATION =====
let chartInstances = {}; // Store chart instances for updates

function initializeCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('⚠️ Chart.js not loaded');
    return;
  }
  
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary').trim();
  
  initWasteDistributionChart();
  initMonthlyTrendChart();
  initCollectionPointsChart();
  initAIAccuracyChart();
  
  console.log('✅ All charts initialized');
}

function initWasteDistributionChart() {
  const ctx = document.getElementById('wasteDistChart');
  if (!ctx) return;
  
  chartInstances.wasteDistribution = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: MOCK_DATA.wasteDistribution.labels,
      datasets: [{
        data: MOCK_DATA.wasteDistribution.data,
        backgroundColor: MOCK_DATA.wasteDistribution.colors,
        borderWidth: 0,
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} kg (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function initMonthlyTrendChart() {
  const ctx = document.getElementById('monthlyTrendChart');
  if (!ctx) return;
  
  chartInstances.monthlyTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MOCK_DATA.monthlyTrend.labels,
      datasets: [
        {
          label: 'Người dùng mới',
          data: MOCK_DATA.monthlyTrend.users,
          borderColor: '#5865F2',
          backgroundColor: 'rgba(88, 101, 242, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#5865F2',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Lượng rác (x10 kg)',
          data: MOCK_DATA.monthlyTrend.waste,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
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
      plugins: {
        legend: { 
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12
        }
      },
      scales: {
        y: { 
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initCollectionPointsChart() {
  const ctx = document.getElementById('collectionPointsChart');
  if (!ctx) return;
  
  chartInstances.collectionPoints = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MOCK_DATA.collectionPoints.labels,
      datasets: [{
        label: 'Kg rác thu gom',
        data: MOCK_DATA.collectionPoints.data,
        backgroundColor: [
          'rgba(88, 101, 242, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderRadius: 8,
        barThickness: 32
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} kg rác đã thu gom`;
            }
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initAIAccuracyChart() {
  const ctx = document.getElementById('aiAccuracyTrendChart');
  if (!ctx) return;
  
  chartInstances.aiAccuracy = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MOCK_DATA.aiAccuracy.trend.map(d => `Ngày ${d.day}`),
      datasets: [{
        label: 'Độ chính xác (%)',
        data: MOCK_DATA.aiAccuracy.trend.map(d => d.accuracy),
        borderColor: '#5865F2',
        backgroundColor: 'rgba(88, 101, 242, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          callbacks: {
            label: function(context) {
              return `Độ chính xác: ${context.parsed.y.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: false,
          min: 85,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        }
      }
    }
  });
}

// ===== DATE RANGE PICKER =====
function updateDateRangeDisplay() {
  const dateRangeText = document.getElementById('dateRangeText');
  if (!dateRangeText) return;
  
  const start = document.getElementById('startDate');
  const end = document.getElementById('endDate');
  
  if (start && end && start.value && end.value) {
    const startDate = new Date(start.value);
    const endDate = new Date(end.value);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 7) {
      dateRangeText.textContent = '7 ngày qua';
    } else if (daysDiff === 30) {
      dateRangeText.textContent = '30 ngày qua';
    } else {
      dateRangeText.textContent = `${daysDiff} ngày (${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')})`;
    }
  }
}

// ===== DATE RANGE VALIDATION =====
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');

if (startDate && endDate) {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
  endDate.value = today.toISOString().split('T')[0];
  
  const validateDateRange = () => {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    
    if (start > end) {
      showToast('Ngày bắt đầu không thể sau ngày kết thúc', 'error');
      startDate.value = endDate.value;
    } else {
      updateDateRangeDisplay();
      showToast('Đã cập nhật khoảng thời gian', 'success');
    }
  };
  
  startDate.addEventListener('change', validateDateRange);
  endDate.addEventListener('change', validateDateRange);
  updateDateRangeDisplay();
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K: Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.search-box input, #userSearch');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }
  
  // Escape: Close modal
  if (e.key === 'Escape') {
    const modal = document.querySelector('.modal-overlay.active');
    if (modal) {
      closeModal(modal.querySelector('.modal-close'));
    }
  }
  
  // Ctrl/Cmd + E: Export
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    exportData('csv');
  }
});

// ===== QUICK ACTIONS =====
document.querySelectorAll('.quick-action-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const action = this.getAttribute('data-action');
    handleQuickAction(action);
  });
});

function handleQuickAction(action) {
  const actions = {
    'export-pdf': () => exportData('pdf'),
    'export-excel': () => exportData('excel'),
    'export-csv': () => exportData('csv'),
    'add-user': () => openModal('addUserModal'),
    'add-location': () => openModal('addPointModal'),
    'add-reward': () => openModal('addRewardModal'),
    'add-badge': () => openModal('addBadgeModal'),
    'create-campaign': () => openModal('createCampaignModal'),
    'broadcast': () => showToast('Chức năng đang phát triển', 'info'),
    'backup': () => {
      showToast('Đang sao lưu dữ liệu...', 'info');
      setTimeout(() => showToast('Sao lưu thành công!', 'success'), 2000);
    },
    'refresh': () => {
      simulateRealtimeData();
      showToast('Đã làm mới dữ liệu', 'success');
    }
  };
  
  if (actions[action]) {
    actions[action]();
  } else {
    console.warn('Unknown action:', action);
  }
}

// ===== AUTO REFRESH SYSTEM =====
let refreshInterval = null;

function startAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(async () => {
    try {
      // For mockup: simulate data update
      simulateRealtimeData();
      
      // For production: fetch real data
      // const response = await fetch('/api/dashboard/stats');
      // if (!response.ok) throw new Error('Network response was not ok');
      // const data = await response.json();
      // updateDashboard(data);
      
    } catch (err) {
      console.error('❌ Error refreshing stats:', err);
    }
  }, CONFIG.REFRESH_INTERVAL);
  
  console.log('🔄 Auto-refresh started (every 30s)');
}

function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('⏸️ Auto-refresh stopped');
  }
}

// Pause refresh when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAutoRefresh();
  } else {
    startAutoRefresh();
  }
});

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('%c🌿 Green Spring Admin Dashboard', 'color: #10B981; font-size: 24px; font-weight: bold;');
  console.log('%cDeveloped with ❤️ by Green Spring Team', 'color: #5865F2; font-size: 14px;');
  console.log('%cMockdata Mode: Active', 'color: #F59E0B; font-size: 12px;');
  console.log('%cKeyboard Shortcuts: Ctrl+K (Search), Ctrl+E (Export), Esc (Close)', 'color: #6B7280; font-size: 11px;');
  
  // Initialize all components
  initializeCounters();
  initializeCharts();
  updateDateRangeDisplay();
  
  // Start auto-refresh
  startAutoRefresh();
  
  // Log mock data info
  console.table({
    'KPI Cards': Object.keys(MOCK_DATA.kpi).length,
    'Chart Data': Object.keys(MOCK_DATA).length - 1,
    'Activities': MOCK_DATA.activities.length,
    'Leaderboard': MOCK_DATA.leaderboard.length,
    'Heatmap Days': MOCK_DATA.heatmapData.length
  });
  
  // Show welcome message
  setTimeout(() => {
    showToast('Dashboard đã sẵn sàng! 🚀', 'success');
  }, 500);
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  stopAutoRefresh();
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.exportData = exportData;
window.handleModalSubmit = handleModalSubmit;

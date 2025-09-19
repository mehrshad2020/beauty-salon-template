// ===== Theme Management =====
let currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
  currentTheme = theme;
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
  
  // Update charts colors if they exist
  if (window.revenueChart) {
    updateChartColors();
  }
}

function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
  setTheme(currentTheme);
  initializeCharts();
  initializeNavigation();
  initializeMobileMenu();
});

// ===== Navigation Management =====
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // If link has href attribute, let it navigate normally
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        // For external links or separate pages, don't prevent default
        return true;
      }
      
      // For single page navigation (if any), prevent default
      e.preventDefault();
      
      // Close mobile sidebar if open
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
  
  // Handle active state based on current page
  const currentPage = window.location.pathname.split('/').pop();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== Mobile Menu Management =====
function initializeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  
  // Close sidebar when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !e.target.closest('.btn-menu')) {
      closeSidebar();
    }
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('show');
}

// ===== Charts =====
let revenueChart, servicesChart;

function initializeCharts() {
  initializeRevenueChart();
  initializeServicesChart();
}

function getChartColors() {
  const theme = currentTheme;
  const colors = {
    light: {
      primary: '#e91e63',
      secondary: '#9c27b0',
      accent: '#ffd700',
      success: '#4caf50',
      warning: '#ff9800',
      info: '#00bcd4',
      text: '#212529',
      grid: '#e9ecef'
    },
    dark: {
      primary: '#e91e63',
      secondary: '#9c27b0',
      accent: '#ffd700',
      success: '#4caf50',
      warning: '#ff9800',
      info: '#00bcd4',
      text: '#ffffff',
      grid: '#404040'
    }
  };
  
  return colors[theme];
}

function initializeRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  
  const colors = getChartColors();
  
  const data = {
    labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
    datasets: [{
      label: 'درآمد (تومان)',
      data: [1200000, 1900000, 3000000, 2100000, 2800000, 2450000, 1800000],
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: colors.primary,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };
  
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: colors.text,
            font: {
              family: 'Vazirmatn',
              size: 12
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: colors.text,
            font: {
              family: 'Vazirmatn'
            },
            callback: function(value) {
              return new Intl.NumberFormat('fa-IR').format(value);
            }
          },
          grid: {
            color: colors.grid
          }
        },
        x: {
          ticks: {
            color: colors.text,
            font: {
              family: 'Vazirmatn'
            }
          },
          grid: {
            color: colors.grid
          }
        }
      },
      elements: {
        point: {
          hoverBackgroundColor: colors.primary
        }
      }
    }
  };
  
  revenueChart = new Chart(ctx, config);
}

function initializeServicesChart() {
  const ctx = document.getElementById('servicesChart');
  if (!ctx) return;
  
  const colors = getChartColors();
  
  const data = {
    labels: ['کوتاهی مو', 'رنگ مو', 'میکاپ', 'ناخن', 'ابرو'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        colors.primary,
        colors.secondary,
        colors.accent,
        colors.info,
        colors.warning
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 4
    }]
  };
  
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: colors.text,
            font: {
              family: 'Vazirmatn',
              size: 11
            },
            padding: 15
          }
        }
      }
    }
  };
  
  servicesChart = new Chart(ctx, config);
}

function updateChartColors() {
  if (revenueChart) {
    const colors = getChartColors();
    
    // Update revenue chart
    revenueChart.data.datasets[0].borderColor = colors.primary;
    revenueChart.data.datasets[0].backgroundColor = `${colors.primary}20`;
    revenueChart.data.datasets[0].pointBackgroundColor = colors.primary;
    
    revenueChart.options.plugins.legend.labels.color = colors.text;
    revenueChart.options.scales.y.ticks.color = colors.text;
    revenueChart.options.scales.x.ticks.color = colors.text;
    revenueChart.options.scales.y.grid.color = colors.grid;
    revenueChart.options.scales.x.grid.color = colors.grid;
    
    revenueChart.update();
  }
  
  if (servicesChart) {
    const colors = getChartColors();
    
    // Update services chart
    servicesChart.data.datasets[0].backgroundColor = [
      colors.primary,
      colors.secondary,
      colors.accent,
      colors.info,
      colors.warning
    ];
    
    servicesChart.options.plugins.legend.labels.color = colors.text;
    
    servicesChart.update();
  }
}

// ===== Animations =====
function addLoadingAnimation(element) {
  element.classList.add('loading');
}

function removeLoadingAnimation(element) {
  element.classList.remove('loading');
}

// ===== Utility Functions =====
function formatNumber(number) {
  return new Intl.NumberFormat('fa-IR').format(number);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fa-IR').format(new Date(date));
}

// ===== Quick Actions =====
document.addEventListener('click', function(e) {
  // Handle quick action buttons
  if (e.target.closest('.quick-action-btn')) {
    const button = e.target.closest('.quick-action-btn');
    const action = button.querySelector('span').textContent;
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
    
    // Handle different actions
    switch(action) {
      case 'نوبت جدید':
        console.log('ایجاد نوبت جدید');
        // TODO: Open appointment modal
        break;
      case 'مشتری جدید':
        console.log('ایجاد مشتری جدید');
        // TODO: Open customer modal
        break;
      case 'ثبت پرداخت':
        console.log('ثبت پرداخت');
        // TODO: Open payment modal
        break;
      case 'مشاهده انبار':
        console.log('مشاهده انبار');
        // TODO: Navigate to inventory page
        break;
    }
  }
});

// ===== Notifications =====
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi bi-info-circle"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="bi bi-x"></i>
    </button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// ===== Sample Data Management =====
const sampleData = {
  appointments: [
    {
      time: '09:00',
      customer: 'سارا احمدی',
      service: 'کوتاهی مو + میکاپ',
      status: 'confirmed',
      staff: { name: 'مریم کریمی', avatar: 'م' }
    },
    {
      time: '10:30',
      customer: 'فاطمه رضایی',
      service: 'ناخن + ابرو',
      status: 'pending',
      staff: { name: 'زهرا احمدی', avatar: 'ز' }
    },
    {
      time: '14:00',
      customer: 'مینا حسینی',
      service: 'رنگ مو + فر',
      status: 'confirmed',
      staff: { name: 'مریم کریمی', avatar: 'م' }
    }
  ],
  
  stats: {
    todayAppointments: 12,
    todayRevenue: 2450000,
    totalCustomers: 234,
    satisfaction: 4.8
  },
  
  reminders: [
    {
      type: 'birthday',
      icon: 'bi-gift',
      title: 'تولد مشتری',
      description: 'سارا احمدی - امروز',
      color: 'warning'
    },
    {
      type: 'inventory',
      icon: 'bi-exclamation-triangle',
      title: 'کمبود موجودی',
      description: 'شامپو کراتینه',
      color: 'danger'
    },
    {
      type: 'appointment',
      icon: 'bi-clock',
      title: 'نوبت فردا',
      description: 'مینا حسینی - 10:00',
      color: 'info'
    }
  ]
};

// ===== Responsive Handling =====
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
  
  // Update charts on resize
  if (revenueChart) revenueChart.resize();
  if (servicesChart) servicesChart.resize();
});

// ===== Page Visibility =====
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    // Page became visible, refresh data if needed
    console.log('صفحه فعال شد - به‌روزرسانی داده‌ها');
  }
});

// ===== Error Handling =====
window.addEventListener('error', function(e) {
  console.error('خطا در اجرای JavaScript:', e.error);
});

// ===== Development Helper =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🎨 قالب سالن زیبایی - حالت توسعه');
  console.log('📊 داده‌های نمونه:', sampleData);
}


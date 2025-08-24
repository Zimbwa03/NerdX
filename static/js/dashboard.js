/**
 * NerdX Quiz Bot Dashboard JavaScript
 * Handles dashboard interactions, API calls, and UI updates
 */

// Global configuration
const DASHBOARD_CONFIG = {
    refreshInterval: 30000, // 30 seconds
    chartColors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8'
    },
    apiBaseUrl: '/api'
};

// Global state
let dashboardState = {
    isLoading: false,
    lastUpdate: null,
    charts: {},
    intervals: []
};

/**
 * Initialize dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * Main dashboard initialization
 */
function initializeDashboard() {
    console.log('Initializing NerdX Dashboard...');
    
    // Setup error handling
    setupErrorHandling();
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
    
    // Load initial data
    loadDashboardData();
    
    // Setup auto-refresh
    setupAutoRefresh();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    console.log('Dashboard initialized successfully');
}

/**
 * Setup global error handling
 */
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('Global error:', event.error);
        showNotification('An unexpected error occurred', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        showNotification('Network error occurred', 'error');
        event.preventDefault();
    });
}

/**
 * Initialize Bootstrap components
 */
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Load all dashboard data
 */
async function loadDashboardData() {
    if (dashboardState.isLoading) {
        console.log('Dashboard data loading already in progress');
        return;
    }
    
    dashboardState.isLoading = true;
    
    try {
        showLoadingState();
        
        const [statsData, activityData, systemHealth] = await Promise.all([
            fetchDashboardStats(),
            fetchActivityData(),
            fetchSystemHealth()
        ]);
        
        updateDashboardStats(statsData);
        updateActivityFeed(activityData);
        updateSystemStatus(systemHealth);
        
        dashboardState.lastUpdate = new Date();
        hideLoadingState();
        
        console.log('Dashboard data loaded successfully');
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
        hideLoadingState();
    } finally {
        dashboardState.isLoading = false;
    }
}

/**
 * Fetch dashboard statistics
 */
async function fetchDashboardStats() {
    const response = await fetch(`${DASHBOARD_CONFIG.apiBaseUrl}/api/stats`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Fetch activity data
 */
async function fetchActivityData() {
    const response = await fetch(`${DASHBOARD_CONFIG.apiBaseUrl}/api/activity`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Fetch system health data
 */
async function fetchSystemHealth() {
    // Return mock health data since we don't have a health endpoint
    return {
        database: true,
        whatsapp_api: true,
        ai_services: {
            deepseek: true,
            gemini: true
        },
        payment_gateway: false // EcoCash not configured
    };
}

/**
 * Update dashboard statistics display
 */
function updateDashboardStats(data) {
    const elements = {
        'total-users': data.total_users || 0,
        'active-users': data.active_users_today || 0,
        'total-questions': data.total_questions_answered || 0,
        'total-credits': data.total_credits_purchased || 0
    };
    
    // Update each statistic with animation
    Object.entries(elements).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) {
            animateNumber(element, parseInt(value));
        }
    });
    
    // Update subject statistics if available
    if (data.subjects) {
        updateSubjectStats(data.subjects);
    }
}

/**
 * Animate number changes
 */
function animateNumber(element, targetValue) {
    const currentValue = parseInt(element.textContent) || 0;
    const increment = Math.ceil((targetValue - currentValue) / 20);
    
    if (increment === 0) return;
    
    const timer = setInterval(() => {
        const current = parseInt(element.textContent) || 0;
        const newValue = current + increment;
        
        if ((increment > 0 && newValue >= targetValue) || 
            (increment < 0 && newValue <= targetValue)) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = newValue;
        }
    }, 50);
}

/**
 * Update subject statistics
 */
function updateSubjectStats(subjects) {
    // This would update subject-specific displays if they exist
    console.log('Updating subject stats:', subjects);
}

/**
 * Update activity feed
 */
function updateActivityFeed(data) {
    const activityElement = document.getElementById('recent-activity');
    
    if (!activityElement) return;
    
    if (!data || !Array.isArray(data.recent_activities)) {
        activityElement.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    <i class="fas fa-info-circle me-2"></i>
                    No recent activity data available
                </td>
            </tr>
        `;
        return;
    }
    
    const activities = data.recent_activities.slice(0, 10); // Show last 10 activities
    
    activityElement.innerHTML = activities.map(activity => `
        <tr>
            <td>${activity.user || 'Unknown User'}</td>
            <td>
                <i class="fas fa-${getActivityIcon(activity.type)} me-2"></i>
                ${activity.description || activity.type}
            </td>
            <td>
                <span class="badge bg-${getSubjectColor(activity.subject)}">
                    ${activity.subject || 'General'}
                </span>
            </td>
            <td>
                <small class="text-muted">${formatTime(activity.timestamp)}</small>
            </td>
        </tr>
    `).join('');
}

/**
 * Get icon for activity type
 */
function getActivityIcon(type) {
    const icons = {
        'question_answered': 'question-circle',
        'user_registered': 'user-plus',
        'credit_purchased': 'coins',
        'payment_completed': 'credit-card',
        'login': 'sign-in-alt',
        'logout': 'sign-out-alt',
        'default': 'circle'
    };
    
    return icons[type] || icons.default;
}

/**
 * Get color for subject badge
 */
function getSubjectColor(subject) {
    const colors = {
        'Mathematics': 'primary',
        'Biology': 'success',
        'Chemistry': 'warning',
        'Physics': 'info',
        'English': 'secondary',
        'default': 'dark'
    };
    
    return colors[subject] || colors.default;
}

/**
 * Format timestamp for display
 */
function formatTime(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString();
}

/**
 * Update system status indicators
 */
function updateSystemStatus(healthData) {
    const statusElements = {
        'db-status': {
            value: healthData.database,
            trueText: 'Connected',
            falseText: 'Disconnected',
            trueClass: 'bg-success',
            falseClass: 'bg-danger'
        },
        'whatsapp-status': {
            value: healthData.whatsapp_api,
            trueText: 'Online',
            falseText: 'Offline',
            trueClass: 'bg-success',
            falseClass: 'bg-danger'
        },
        'ai-status': {
            value: healthData.ai_services?.deepseek && healthData.ai_services?.gemini,
            trueText: 'Available',
            falseText: 'Limited',
            trueClass: 'bg-success',
            falseClass: 'bg-warning'
        },
        'payment-status': {
            value: healthData.payment_gateway,
            trueText: 'Online',
            falseText: 'Limited',
            trueClass: 'bg-success',
            falseClass: 'bg-warning'
        }
    };
    
    Object.entries(statusElements).forEach(([elementId, config]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = `badge ${config.value ? config.trueClass : config.falseClass}`;
            element.textContent = config.value ? config.trueText : config.falseText;
        }
    });
}

/**
 * Setup auto-refresh functionality
 */
function setupAutoRefresh() {
    const interval = setInterval(() => {
        if (!dashboardState.isLoading) {
            loadDashboardData();
        }
    }, DASHBOARD_CONFIG.refreshInterval);
    
    dashboardState.intervals.push(interval);
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + R for refresh
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            refreshDashboard();
        }
        
        // Escape to close modals
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) modalInstance.hide();
            });
        }
    });
}

/**
 * Show loading state
 */
function showLoadingState() {
    // Add loading indicators to stat cards
    const statCards = document.querySelectorAll('[id$="-users"], [id$="-questions"], [id$="-credits"]');
    statCards.forEach(card => {
        if (card && !card.textContent.includes('...')) {
            card.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
    });
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    // Remove any loading spinners (they'll be replaced by actual data)
    console.log('Loading state hidden');
}

/**
 * Refresh dashboard manually
 */
function refreshDashboard() {
    console.log('Manual dashboard refresh triggered');
    loadDashboardData();
    showNotification('Dashboard refreshed', 'success');
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

/**
 * Utility function to format numbers
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Utility function to format currency
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Utility function to format percentages
 */
function formatPercentage(value, decimals = 1) {
    return (value * 100).toFixed(decimals) + '%';
}

/**
 * Export dashboard data
 */
function exportDashboardData() {
    showNotification('Export feature coming soon!', 'info');
}

/**
 * Cleanup dashboard resources
 */
function cleanupDashboard() {
    // Clear intervals
    dashboardState.intervals.forEach(interval => clearInterval(interval));
    dashboardState.intervals = [];
    
    // Destroy charts if they exist
    Object.values(dashboardState.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    
    dashboardState.charts = {};
    
    console.log('Dashboard cleanup completed');
}

/**
 * Handle window beforeunload for cleanup
 */
window.addEventListener('beforeunload', function() {
    cleanupDashboard();
});

/**
 * Handle visibility change to pause/resume updates
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause updates
        dashboardState.intervals.forEach(interval => clearInterval(interval));
        console.log('Dashboard updates paused');
    } else {
        // Page is visible, resume updates
        setupAutoRefresh();
        loadDashboardData();
        console.log('Dashboard updates resumed');
    }
});

// Export functions for use in HTML
window.refreshDashboard = refreshDashboard;
window.exportDashboardData = exportDashboardData;
window.showNotification = showNotification;

// Log successful initialization
console.log('Dashboard JavaScript loaded successfully');

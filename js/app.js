// Main application logic - Mobile Optimized

const dataManager = new DataManager();

// DOM Elements
const timeline = document.getElementById('timeline');
const membersGrid = document.getElementById('members-grid');
const badgesList = document.getElementById('badges-list');
const eventModal = document.getElementById('event-modal');
const eventForm = document.getElementById('event-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const yearFilter = document.getElementById('year-filter');
const themeToggle = document.getElementById('theme-toggle');
const settingsToggle = document.getElementById('settings-toggle');
const settingsMenu = document.getElementById('settings-menu');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    renderTimeline();
    renderMembers();
    renderBadges();
    populateYearFilter();
    populateAuthorSelect();
    setupEventListeners();
});

// Mobile Navigation
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}-section`).classList.add('active');
            
            // Scroll to top on tab change
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Settings Menu Toggle
settingsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!settingsMenu.contains(e.target) && e.target !== settingsToggle) {
        settingsMenu.classList.remove('active');
    }
});

// Render Timeline
function renderTimeline(filters = {}) {
    const events = dataManager.getEvents(filters);
    timeline.innerHTML = '';
    
    if (events.length === 0) {
        timeline.innerHTML = '<p class="empty-state">Пока нет воспоминаний. Добавьте первое!</p>';
        return;
    }
    
    events.forEach(event => {
        const member = dataManager.getMemberById(event.author_id);
        const card = createEventCard(event, member);
        timeline.appendChild(card);
    });
}

function createEventCard(event, member) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-date">${formatDate(event.date)}</div>
        <div class="event-category">${getCategoryIcon(event.category)} ${event.category}</div>
        <h3>${event.title}</h3>
        ${event.media ? `<img src="${event.media}" alt="${event.title}" class="event-media">` : ''}
        <p class="event-description">${formatMarkdown(event.description)}</p>
        <div class="event-author">Автор: ${member ? member.name : 'Неизвестно'}</div>
    `;
    return card;
}

// Render Members
function renderMembers() {
    const members = dataManager.getMembers();
    membersGrid.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <h3>${member.name}</h3>
            <p class="member-bio">${member.bio}</p>
            <div class="member-badges">
                ${member.badges.map(b => `<span class="badge">${b}</span>`).join('')}
            </div>
            ${member.quote ? `<p class="member-quote">"${member.quote}"</p>` : ''}
            <p class="member-stats">📝 Воспоминаний: ${member.stats}</p>
        `;
        membersGrid.appendChild(card);
    });
}

// Render Badges
function renderBadges() {
    const members = dataManager.getMembers();
    badgesList.innerHTML = '';
    
    const allBadges = members.flatMap(m => 
        m.badges.map(b => ({ badge: b, member: m.name }))
    );
    
    if (allBadges.length === 0) {
        badgesList.innerHTML = '<p class="empty-state">Пока нет ачивок</p>';
        return;
    }
    
    allBadges.forEach(({ badge, member }) => {
        const item = document.createElement('div');
        item.className = 'badge-item';
        item.innerHTML = `<span class="badge-icon">🏆</span> <strong>${badge}</strong> - ${member}`;
        badgesList.appendChild(item);
    });
}

// Modal Controls
document.getElementById('add-event-btn').addEventListener('click', () => {
    eventModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

document.querySelector('.close').addEventListener('click', () => {
    eventModal.style.display = 'none';
    document.body.style.overflow = '';
});

window.addEventListener('click', (e) => {
    if (e.target === eventModal) {
        eventModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Event Form Submit
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventData = {
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        category: document.getElementById('event-category').value,
        description: document.getElementById('event-description').value,
        media: document.getElementById('event-media').value,
        author_id: parseInt(document.getElementById('event-author').value)
    };
    
    dataManager.addEvent(eventData);
    renderTimeline();
    renderMembers();
    populateYearFilter();
    eventForm.reset();
    eventModal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Show success feedback
    showToast('Воспоминание добавлено!');
});

// Filters
function setupEventListeners() {
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const filters = {
        search: searchInput.value,
        category: categoryFilter.value,
        year: yearFilter.value
    };
    renderTimeline(filters);
}

// Export/Import
document.getElementById('export-btn').addEventListener('click', () => {
    dataManager.exportData();
    settingsMenu.classList.remove('active');
    showToast('Данные экспортированы!');
});

document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-file').click();
    settingsMenu.classList.remove('active');
});

document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (dataManager.importData(event.target.result)) {
                showToast('Данные импортированы!');
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast('Ошибка импорта данных');
            }
        };
        reader.readAsText(file);
    }
});

// Helper Functions
function populateYearFilter() {
    const years = dataManager.getYears();
    yearFilter.innerHTML = '<option value="">Все годы</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

function populateAuthorSelect() {
    const members = dataManager.getMembers();
    const select = document.getElementById('event-author');
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function getCategoryIcon(category) {
    const icons = {
        'Travel': '✈️',
        'Humor': '😄',
        'Achievement': '🏆'
    };
    return icons[category] || '📌';
}

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: calc(var(--bottom-nav-height) + 20px);
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-dark);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        z-index: 1001;
        animation: slideUp 0.3s;
        box-shadow: 0 4px 12px var(--shadow);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

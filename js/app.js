// Main application logic - Mobile Optimized with Groups

const dataManager = new DataManager();
let currentGroupId = null;

// DOM Elements
const groupsList = document.getElementById('groups-list');
const timeline = document.getElementById('timeline');
const membersGrid = document.getElementById('members-grid');
const badgesList = document.getElementById('badges-list');
const eventModal = document.getElementById('event-modal');
const groupModal = document.getElementById('group-modal');
const settingsModal = document.getElementById('settings-modal');
const eventForm = document.getElementById('event-form');
const groupForm = document.getElementById('group-form');
const searchInput = document.getElementById('search-input');
const groupsSearch = document.getElementById('groups-search');
const categoryFilter = document.getElementById('category-filter');
const yearFilter = document.getElementById('year-filter');
const themeToggle = document.getElementById('theme-toggle');
const mainNav = document.getElementById('main-nav');
const groupNav = document.getElementById('group-nav');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    renderGroupsList();
    setupEventListeners();
    setupBackButtons();
});

// Navigation between main screen and group screen
function initNavigation() {
    // Main navigation (Groups/Settings)
    const mainNavBtns = mainNav.querySelectorAll('.nav-btn');
    mainNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            mainNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (targetTab === 'groups') {
                showGroupsList();
            } else if (targetTab === 'settings') {
                settingsModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Group navigation (Timeline/Members/Map/Badges)
    const groupNavBtns = groupNav.querySelectorAll('.nav-btn');
    groupNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            groupNavBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${targetTab}-section`).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Show groups list (main screen)
function showGroupsList() {
    currentGroupId = null;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('groups-section').classList.add('active');
    mainNav.style.display = 'flex';
    groupNav.style.display = 'none';
    renderGroupsList();
}

// Enter group
function enterGroup(groupId) {
    currentGroupId = groupId;
    const group = dataManager.getGroupById(groupId);
    
    document.getElementById('current-group-name').textContent = group.name;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('timeline-section').classList.add('active');
    
    mainNav.style.display = 'none';
    groupNav.style.display = 'flex';
    groupNav.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    groupNav.querySelector('[data-tab="timeline"]').classList.add('active');
    
    renderTimeline();
    renderMembers();
    renderBadges();
    populateYearFilter();
    populateAuthorSelect();
}

// Back buttons
function setupBackButtons() {
    document.getElementById('back-to-groups').addEventListener('click', showGroupsList);
    document.getElementById('back-to-groups-members').addEventListener('click', showGroupsList);
    document.getElementById('back-to-groups-map').addEventListener('click', showGroupsList);
    document.getElementById('back-to-groups-badges').addEventListener('click', showGroupsList);
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

// Render Groups List
function renderGroupsList(searchQuery = '') {
    const groups = dataManager.getGroups(searchQuery);
    groupsList.innerHTML = '';
    
    if (groups.length === 0) {
        groupsList.innerHTML = '<p class="empty-state">Пока нет групп. Создайте первую!</p>';
        return;
    }
    
    groups.forEach(group => {
        const card = document.createElement('div');
        card.className = 'group-card';
        card.innerHTML = `
            <div class="group-avatar">${group.name.charAt(0).toUpperCase()}</div>
            <div class="group-info">
                <h3>${group.name}</h3>
                <p class="group-meta">👥 ${group.members.length} участников • 📝 ${group.events.length} событий</p>
                ${group.description ? `<p class="group-description">${group.description}</p>` : ''}
            </div>
        `;
        card.addEventListener('click', () => enterGroup(group.id));
        groupsList.appendChild(card);
    });
}

// Groups search with position change
const searchBarBottom = document.getElementById('search-bar-bottom');

groupsSearch.addEventListener('focus', () => {
    searchBarBottom.classList.add('active');
    setTimeout(() => {
        groupsSearch.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
});

groupsSearch.addEventListener('blur', () => {
    if (!groupsSearch.value) {
        searchBarBottom.classList.remove('active');
    }
});

groupsSearch.addEventListener('input', (e) => {
    renderGroupsList(e.target.value);
    if (!e.target.value) {
        searchBarBottom.classList.remove('active');
    }
});

// Render Timeline
function renderTimeline(filters = {}) {
    if (!currentGroupId) return;
    
    const events = dataManager.getEvents(currentGroupId, filters);
    timeline.innerHTML = '';
    
    if (events.length === 0) {
        timeline.innerHTML = '<p class="empty-state">Пока нет воспоминаний. Добавьте первое!</p>';
        return;
    }
    
    events.forEach(event => {
        const member = dataManager.getMemberById(currentGroupId, event.author_id);
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
    if (!currentGroupId) return;
    
    const members = dataManager.getMembers(currentGroupId);
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
    if (!currentGroupId) return;
    
    const members = dataManager.getMembers(currentGroupId);
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

// FAB button - context aware
document.getElementById('add-btn').addEventListener('click', () => {
    if (currentGroupId) {
        // Inside group - add event
        eventModal.style.display = 'block';
    } else {
        // Main screen - create group
        groupModal.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';
});

// Modal close buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modalType = closeBtn.dataset.modal;
        if (modalType === 'event') {
            eventModal.style.display = 'none';
        } else if (modalType === 'group') {
            groupModal.style.display = 'none';
        } else if (modalType === 'settings') {
            settingsModal.style.display = 'none';
        }
        document.body.style.overflow = '';
    });
});

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === eventModal) {
        eventModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (e.target === groupModal) {
        groupModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Group Form Submit
groupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const groupData = {
        name: document.getElementById('group-name').value,
        description: document.getElementById('group-description').value
    };
    
    dataManager.addGroup(groupData);
    renderGroupsList();
    groupForm.reset();
    groupModal.style.display = 'none';
    document.body.style.overflow = '';
    
    showToast('Группа создана!');
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
    
    dataManager.addEvent(currentGroupId, eventData);
    renderTimeline();
    renderMembers();
    renderGroupsList();
    populateYearFilter();
    eventForm.reset();
    eventModal.style.display = 'none';
    document.body.style.overflow = '';
    
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
    settingsModal.style.display = 'none';
    document.body.style.overflow = '';
    showToast('Данные экспортированы!');
});

document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-file').click();
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
    if (!currentGroupId) return;
    
    const years = dataManager.getYears(currentGroupId);
    yearFilter.innerHTML = '<option value="">Все годы</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

function populateAuthorSelect() {
    if (!currentGroupId) return;
    
    const members = dataManager.getMembers(currentGroupId);
    const select = document.getElementById('event-author');
    select.innerHTML = '<option value="">Автор</option>';
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

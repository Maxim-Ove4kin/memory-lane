// Data structure and localStorage management with Groups support

const DEFAULT_DATA = {
    groups: [
        {
            id: 1,
            name: "Семья",
            description: "Наша дружная семья",
            members: [
                { id: 1, name: "Алекс", bio: "Мастер багов", badges: ["Coffee Addict"], quote: "", stats: 2 },
                { id: 2, name: "Мария", bio: "Душа компании", badges: ["Party Master"], quote: "", stats: 1 }
            ],
            events: [
                {
                    id: 101,
                    date: "2023-05-15",
                    title: "Поход на Алтай",
                    description: "Тот самый день, когда мы потеряли палатку. Незабываемое приключение в горах!",
                    author_id: 1,
                    category: "Travel",
                    media: "",
                    location: { lat: 50.0, lng: 85.0 }
                },
                {
                    id: 102,
                    date: "2024-08-20",
                    title: "День рождения на даче",
                    description: "Шашлыки, баня и ночёвка под звёздами. Лучший день рождения!",
                    author_id: 2,
                    category: "Achievement",
                    media: "",
                    location: { lat: 55.7558, lng: 37.6173 }
                },
                {
                    id: 103,
                    date: "2022-12-31",
                    title: "Новый год в Питере",
                    description: "Встречали Новый год в Санкт-Петербурге. Фейерверк на Дворцовой был шикарным!",
                    author_id: 1,
                    category: "Travel",
                    media: "",
                    location: { lat: 59.9343, lng: 30.3351 }
                },
                {
                    id: 104,
                    date: "2024-03-10",
                    title: "Концерт в Москве",
                    description: "Ходили на концерт любимой группы. Зал взорвался от восторга!",
                    author_id: 2,
                    category: "Humor",
                    media: "",
                    location: { lat: 55.7650, lng: 37.5900 }
                }
            ]
        },
        {
            id: 2,
            name: "Компания друзей",
            description: "Лучшие друзья со школы",
            members: [
                { id: 3, name: "Дима", bio: "Генератор идей", badges: ["Шутник"], quote: "", stats: 1 },
                { id: 4, name: "Катя", bio: "Фотограф", badges: ["Наблюдатель"], quote: "", stats: 0 }
            ],
            events: [
                {
                    id: 201,
                    date: "2024-06-01",
                    title: "Пикник на озере",
                    description: "Отличный день у воды! Купались, жарили сосиски, играли в волейбол.",
                    author_id: 3,
                    category: "Travel",
                    media: "",
                    location: { lat: 55.5, lng: 36.0 }
                }
            ]
        }
    ]
};

class DataManager {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('memoryLaneData');
        return stored ? JSON.parse(stored) : DEFAULT_DATA;
    }

    saveData() {
        localStorage.setItem('memoryLaneData', JSON.stringify(this.data));
    }

    // Groups management
    getGroups(searchQuery = '') {
        let groups = this.data.groups || [];
        
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            groups = groups.filter(g => 
                g.name.toLowerCase().includes(search) ||
                (g.description && g.description.toLowerCase().includes(search))
            );
        }
        
        return groups;
    }

    getGroupById(groupId) {
        return this.data.groups.find(g => g.id === groupId);
    }

    addGroup(groupData) {
        const newGroup = {
            id: Date.now(),
            name: groupData.name,
            description: groupData.description || '',
            members: [],
            events: []
        };
        
        this.data.groups.push(newGroup);
        this.saveData();
        return newGroup;
    }

    // Events management
    addEvent(groupId, eventData) {
        const group = this.getGroupById(groupId);
        if (!group) return null;
        
        const lat = parseFloat(document.getElementById('event-lat')?.value) || 0;
        const lng = parseFloat(document.getElementById('event-lng')?.value) || 0;
        
        const newEvent = {
            id: Date.now(),
            title: eventData.title,
            date: eventData.date,
            category: eventData.category,
            description: eventData.description,
            media: eventData.media,
            author_id: parseInt(eventData.author_id),
            location: { lat, lng }
        };
        
        group.events.push(newEvent);
        
        // Update member stats
        const member = group.members.find(m => m.id === parseInt(eventData.author_id));
        if (member) member.stats++;
        
        this.saveData();
        return newEvent;
    }

    getEvents(groupId, filters = {}) {
        const group = this.getGroupById(groupId);
        if (!group) return [];
        
        let events = [...group.events];
        
        if (filters.category) {
            events = events.filter(e => e.category === filters.category);
        }
        
        if (filters.year) {
            events = events.filter(e => e.date.startsWith(filters.year));
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            events = events.filter(e => 
                e.title.toLowerCase().includes(search) || 
                e.description.toLowerCase().includes(search)
            );
        }
        
        return events.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Members management
    getMembers(groupId) {
        const group = this.getGroupById(groupId);
        return group ? group.members : [];
    }

    getMemberById(groupId, memberId) {
        const group = this.getGroupById(groupId);
        if (!group) return null;
        return group.members.find(m => m.id === memberId);
    }

    // Export/Import
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `memory-lane-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(jsonData) {
        try {
            this.data = JSON.parse(jsonData);
            this.saveData();
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }

    getYears(groupId) {
        const group = this.getGroupById(groupId);
        if (!group) return [];
        
        const years = group.events.map(e => e.date.substring(0, 4));
        return [...new Set(years)].sort().reverse();
    }
    
    // Get events with location
    getEventsWithLocation(groupId) {
        const group = this.getGroupById(groupId);
        if (!group) return [];
        
        return group.events.filter(e => e.location && e.location.lat !== 0 && e.location.lng !== 0);
    }
}

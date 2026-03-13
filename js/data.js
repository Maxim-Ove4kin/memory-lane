// Data structure and localStorage management with Groups support

const DEFAULT_DATA = {
    groups: [
        {
            id: 1,
            name: "Семья",
            description: "Наша дружная семья",
            members: [
                { id: 1, name: "Алекс", bio: "Мастер багов", badges: ["Coffee Addict"], quote: "", stats: 1 },
                { id: 2, name: "Мария", bio: "Душа компании", badges: ["Party Master"], quote: "", stats: 0 }
            ],
            events: [
                {
                    id: 101,
                    date: "2023-05-15",
                    title: "Поход на Алтай",
                    description: "Тот самый день, когда мы потеряли палатку.",
                    author_id: 1,
                    category: "Travel",
                    media: "",
                    location: { lat: 50.0, lng: 85.0 }
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
        
        const newEvent = {
            id: Date.now(),
            ...eventData,
            location: { lat: 0, lng: 0 }
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
}

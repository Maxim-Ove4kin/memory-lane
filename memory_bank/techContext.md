# Tech Context

## Стек технологий
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build tool**: Vite 5.0.0
- **Хранение**: localStorage / IndexedDB (PWA)
- **Карта**: OpenStreetMap / Google Maps API (план)
- **AI**: OpenAI API (план)

## Окружение
- Node.js 18+ (для Vite)
- Пакетный менеджер: bun

## Файловая структура
```
/memory-lane
├── index.html
├── package.json
├── vite.config.js
├── js/
│   ├── app.js
│   └── data.js
├── css/
│   └── styles.css
├── AGENTS.md
└── memory_bank/ (документация)
```

## Ограничения
- Без серверной части (все клиентское)
- PWA для офлайн-режима
- Mobile-first дизайн
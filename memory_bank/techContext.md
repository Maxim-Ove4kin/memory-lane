# Tech Context

## Стек технологий
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build tool**: Vite 5.x
- **Formatting / linting**: Biome
- **Хранение**: `localStorage`
- **Карта**: `Leaflet` с тайлами Carto через CDN
- **AI**: не интегрирован, запланирован на будущий этап

## Окружение
- Node.js 18+ (для Vite)
- Пакетный менеджер: bun
- Lockfile: `bun.lock`

## Файловая структура
```
/memory-lane
├── index.html
├── manifest.json
├── docs/
├── package.json
├── vite.config.js
├── js/
│   ├── app.js
│   └── data.js
├── css/
│   └── styles.css
├── AGENTS.md
└── memory_bank/
```

## Ограничения
- Без серверной части и без мультипользовательской синхронизации
- PWA-поддержка частичная: есть `manifest.json`, но нет `service worker`
- Mobile-first интерфейс должен корректно работать в светлой и тёмной теме
- В репозитории не должны оставаться legacy-конфиги от неиспользуемого стека

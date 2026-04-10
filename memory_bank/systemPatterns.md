# System Patterns

## Архитектура
Простое SPA-приложение без серверной части. Все данные хранятся локально в браузере.

## Основные модули
- `index.html` — точка входа
- `js/app.js` — основная логика приложения
- `js/data.js` — управление данными
- `css/styles.css` — стили

## Навигация
Роутинг на основе хэша URL (#groups, #timeline, #map, #profile)

## Паттерны
- Модульная структура JS
- CSS-переменные для тем (--primary-color, --bg-color)
- Event-driven архитектура для обновления UI

## Связи подсистем
1. UI -> app.js -> data.js -> localStorage
2. Карта -> внешний API (Google/OpenStreetMap)
3. AI -> внешнее API (OpenAI или аналог)
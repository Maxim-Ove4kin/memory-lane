# Документ проектирования Memory Lane

## Обзор

Memory Lane - это одностраничное веб-приложение (SPA), построенное на чистом JavaScript без фреймворков. Приложение использует модульную архитектуру с четким разделением ответственности между компонентами. Данные хранятся локально в localStorage браузера с возможностью экспорта/импорта через JSON-файлы.

Приложение следует принципам прогрессивного улучшения и обеспечивает полную функциональность даже при отключенном JavaScript (базовая HTML-разметка остается доступной).

## Архитектура

### Общая архитектура
Приложение построено по паттерну MVC (Model-View-Controller):

- **Model**: Управление данными через DataManager класс
- **View**: Компоненты UI (Timeline, MemberProfiles, MemoryMap, BadgeSystem)
- **Controller**: EventHandlers и AppController для координации взаимодействий

### Структура файлов
```
memory-lane/
├── index.html
├── css/
│   ├── main.css
│   ├── themes.css
│   └── components/
│       ├── timeline.css
│       ├── profiles.css
│       ├── map.css
│       └── badges.css
├── js/
│   ├── app.js (главный контроллер)
│   ├── data-manager.js
│   ├── components/
│   │   ├── timeline.js
│   │   ├── member-profiles.js
│   │   ├── memory-map.js
│   │   ├── badge-system.js
│   │   └── search.js
│   └── utils/
│       ├── storage.js
│       ├── validation.js
│       └── markdown.js
└── assets/
    ├── icons/
    └── images/
```

## Компоненты и интерфейсы

### DataManager
Центральный класс для управления всеми данными приложения:

```javascript
class DataManager {
  constructor()
  loadData()
  saveData()
  addEvent(eventData)
  updateEvent(id, eventData)
  deleteEvent(id)
  addMember(memberData)
  updateMember(id, memberData)
  addBadge(memberId, badgeData)
  exportData()
  importData(jsonData)
  validateData(data)
}
```

### Timeline Component
Отвечает за отображение и управление лентой событий:

```javascript
class Timeline {
  constructor(container, dataManager)
  render()
  renderEventCard(event)
  applyFilters(filters)
  addEvent(eventData)
  openEventModal()
  closeEventModal()
}
```

### MemberProfiles Component
Управляет отображением профилей участников:

```javascript
class MemberProfiles {
  constructor(container, dataManager)
  render()
  renderMemberCard(member)
  openMemberModal(memberId)
  updateMemberTags(memberId, tags)
}
```

### MemoryMap Component
Интерактивная карта с отметками событий:

```javascript
class MemoryMap {
  constructor(container, dataManager)
  initializeMap()
  addEventMarkers()
  createMarkerCluster()
  showEventPopup(eventId)
}
```

### BadgeSystem Component
Система достижений и наград:

```javascript
class BadgeSystem {
  constructor(container, dataManager)
  render()
  createBadge(badgeData)
  assignBadge(memberId, badgeId)
  renderBadgeModal()
}
```

## Модели данных

### Event Model
```javascript
{
  id: number,
  title: string,
  description: string,
  date: string (ISO 8601),
  authorId: number,
  category: string,
  media: {
    type: 'image' | 'video' | 'link',
    url: string,
    thumbnail?: string
  },
  location?: {
    lat: number,
    lng: number,
    name: string
  },
  tags: string[],
  createdAt: string,
  updatedAt: string
}
```

### Member Model
```javascript
{
  id: number,
  name: string,
  bio: string,
  avatar?: string,
  tags: string[], // "В чем он хорош"
  quotes: string[], // Любимые цитаты
  badges: Badge[],
  statistics: {
    eventsCreated: number,
    badgesReceived: number,
    joinDate: string
  }
}
```

### Badge Model
```javascript
{
  id: number,
  name: string,
  description: string,
  icon: string,
  category: string,
  givenBy: number, // ID участника, который выдал
  givenAt: string,
  isCustom: boolean
}
```

### Group Model
```javascript
{
  id: number,
  name: string,
  description: string,
  createdAt: string,
  settings: {
    theme: 'light' | 'dark',
    defaultView: 'timeline' | 'map' | 'members',
    allowCustomBadges: boolean
  },
  members: Member[],
  events: Event[]
}
```
## 
Свойства корректности

*Свойство - это характеристика или поведение, которое должно выполняться во всех допустимых выполнениях системы - по сути, формальное утверждение о том, что система должна делать. Свойства служат мостом между человекочитаемыми спецификациями и машинно-проверяемыми гарантиями корректности.*

### Свойство 1: Хронологическая сортировка событий
*Для любого* набора событий с датами, Timeline должен отображать их в хронологическом порядке (от новых к старым)
**Validates: Requirements 1.1**

### Свойство 2: Универсальная фильтрация
*Для любого* набора событий и любого критерия фильтрации (год, категория, автор), результат должен содержать только события, соответствующие критерию
**Validates: Requirements 1.2, 1.3, 1.4**

### Свойство 3: Полнота рендеринга событий
*Для любого* события, его Event_Card должна содержать все обязательные поля: заголовок, дату, описание и информацию об авторе
**Validates: Requirements 1.5**

### Свойство 4: Валидация создания событий
*Для любого* события без заголовка или с пустым заголовком, система должна отклонить создание и показать ошибку
**Validates: Requirements 2.3**

### Свойство 5: Персистентность событий
*Для любого* корректно созданного события, оно должно немедленно сохраняться в localStorage и быть доступно после перезагрузки
**Validates: Requirements 2.2, 2.4**

### Свойство 6: Markdown round-trip
*Для любого* валидного Markdown текста, его парсинг в HTML и обратное преобразование должно сохранить семантическое содержание
**Validates: Requirements 2.5**

### Свойство 7: Полнота рендеринга профиля
*Для любого* участника, его Member_Profile должен отображать все доступные данные: теги, статистику событий и цитаты
**Validates: Requirements 3.3, 3.4, 3.5**

### Свойство 8: Синхронизация карты и событий
*Для любого* события с координатами, на Memory_Map должен появиться соответствующий маркер, и клик по маркеру должен показать информацию о событии
**Validates: Requirements 4.2, 4.3, 4.5**

### Свойство 9: Кластеризация маркеров
*Для любого* набора событий с близкими координатами (в пределах заданного радиуса), они должны группироваться в кластеры на карте
**Validates: Requirements 4.4**

### Свойство 10: Персистентность достижений
*Для любого* выданного достижения, оно должно появиться в профиле получателя и содержать метаданные о выдавшем и времени выдачи
**Validates: Requirements 5.2, 5.3, 5.4, 5.5**

### Свойство 11: Экспорт-импорт round-trip
*Для любых* данных группы, экспорт в JSON и последующий импорт должен восстановить идентичное состояние системы
**Validates: Requirements 6.1, 6.2, 6.4**

### Свойство 12: Валидация импорта
*Для любого* JSON файла с некорректной структурой, импорт должен быть отклонен с сообщением об ошибке, и текущие данные не должны изменяться
**Validates: Requirements 6.3, 6.5**

### Свойство 13: Персистентность и консистентность темы
*Для любого* выбора темы, он должен сохраняться в localStorage, применяться ко всем элементам интерфейса и восстанавливаться после перезагрузки
**Validates: Requirements 7.2, 7.3, 7.4, 7.5**

### Свойство 14: Универсальный поиск
*Для любого* поискового запроса, система должна находить совпадения в заголовках и описаниях событий, выделять найденный текст и показывать все события при пустом запросе
**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

## Обработка ошибок

### Стратегия обработки ошибок
1. **Валидация входных данных**: Все пользовательские вводы валидируются на клиенте
2. **Graceful degradation**: При ошибках загрузки внешних ресурсов (карты, иконки) показываются заглушки
3. **Восстановление состояния**: При ошибках localStorage система пытается восстановить данные из резервной копии
4. **Пользовательские уведомления**: Все ошибки сопровождаются понятными сообщениями для пользователя

### Типы ошибок
- **Ошибки валидации**: Некорректные данные форм
- **Ошибки хранилища**: Проблемы с localStorage (переполнение, недоступность)
- **Ошибки импорта**: Некорректные JSON файлы
- **Ошибки карты**: Недоступность картографических сервисов
- **Ошибки медиа**: Недоступные изображения или видео

## Стратегия тестирования

### Подход к тестированию
Приложение использует двойную стратегию тестирования, сочетающую модульные тесты и тестирование на основе свойств:

- **Модульные тесты** проверяют конкретные примеры, граничные случаи и условия ошибок
- **Тесты на основе свойств** проверяют универсальные свойства, которые должны выполняться для всех входных данных
- Вместе они обеспечивают всестороннее покрытие: модульные тесты выявляют конкретные ошибки, тесты свойств проверяют общую корректность

### Модульное тестирование
Модульные тесты часто покрывают:
- Конкретные примеры, демонстрирующие правильное поведение
- Точки интеграции между компонентами
- Модульные тесты полезны, но следует избегать написания слишком многих
- Задача тестов на основе свойств - покрыть множество входных данных

### Тестирование на основе свойств
- **Библиотека**: fast-check для JavaScript - современная библиотека для property-based testing
- **Конфигурация**: Каждый тест свойств должен выполнять минимум 100 итераций для обеспечения надежности
- **Аннотации**: Каждый тест свойств должен быть помечен комментарием, явно ссылающимся на свойство корректности в документе проектирования
- **Формат тегов**: Использовать точный формат '**Feature: memory-lane, Property {number}: {property_text}**'
- **Соответствие**: Каждое свойство корректности должно быть реализовано ОДНИМ тестом на основе свойств
- **Требования**: Эти требования должны быть явно указаны в части стратегии тестирования документа проектирования

### Структура тестов
```
tests/
├── unit/
│   ├── data-manager.test.js
│   ├── timeline.test.js
│   ├── member-profiles.test.js
│   ├── memory-map.test.js
│   └── badge-system.test.js
├── property/
│   ├── timeline-properties.test.js
│   ├── data-persistence-properties.test.js
│   ├── ui-consistency-properties.test.js
│   └── search-filter-properties.test.js
└── integration/
    ├── export-import.test.js
    └── theme-switching.test.js
```

### Генераторы для тестирования свойств
- **Event Generator**: Создает случайные события с валидными и граничными данными
- **Member Generator**: Генерирует профили участников с различными наборами данных
- **Coordinate Generator**: Создает географические координаты для тестирования карты
- **JSON Generator**: Генерирует валидные и невалидные JSON структуры для тестирования импорта
- **Theme Generator**: Создает различные конфигурации тем для тестирования переключения
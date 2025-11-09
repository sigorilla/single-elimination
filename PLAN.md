## План разработки MVP для Single-Elimination Brackets

### 1. Архитектура и стек
- **Фреймворк**: React + TypeScript, менеджмент состояний через React Context/Reducer (без внешних библиотек).
- **Хранение данных**: localStorage (обёртка-репозиторий c JSON-сериализацией).
- **Сборка**: Vite или CRA (предпочтительно Vite для скорости); конфигурация для GitHub Pages.
- **Структура проекта**:
  ```
  src/
    components/
    pages/
    modules/
      tournament/
      storage/
      csv/
    hooks/
    types/
    utils/
  public/
  ```
- **Деплой**: GitHub Pages, настройка GitHub Actions (npm run build -> deploy в gh-pages branch).

### 2. Моделирование данных
- **Типы**:
  ```ts
  type Item = { id: string; name: string; description?: string; image?: string; };
  type Match = { id: string; round: number; left?: Item; right?: Item; winner?: Item['id']; };
  type Tournament = {
      id: string;
      title: string;
      createdAt: string;
      items: Item[];
      matches: Match[];
      status: 'draft' | 'running' | 'finished';
      winnerId?: string;
  };
  ```
- **Хранение**:
  - `localStorage["se:tournaments"]` — массив турниров.
  - Сервис `TournamentRepository` (CRUD, получение по id, обновление статуса, очистка).

### 3. Пользовательские сценарии
1. **Создание списка**:
   - Страница /import: форма + drag&drop CSV (поля: name, description?, image? URL/base64).
   - Ручное добавление: форма добавления элемента (название обязательно).
   - Предпросмотр списка (таблица, счётчик).
   - Валидация (минимум 2 элемента, уникальные id).
2. **Настройка турнира**:
   - Страница /setup: выбор shuffle, best-of? (MVP: нет), название турнира.
   - Кнопка “Сгенерировать сетку”.
3. **Геймплей**:
   - Страница /play/{id}: отображение текущего раунда.
   - Карточки 2 участников с фото, описанием, кнопки “Выбрать победителя”.
   - Прогресс-бар/индикатор раундов.
   - По выбору — запись победителя, переход к следующему матчу.
   - В конце — экран победителя, кнопки “Сыграть заново”, “Экспорт результатов”.
4. **История турниров**:
   - Главная /: список сохранённых турниров (карточка, статус, победитель).
   - Возможность удалить или переиграть.

### 4. Генерация и логика сетки
- **Алгоритм**:
  1. Перемешать список (опционально).
  2. Добавить byes, если количество не степень двойки (добавляем фиктивные матчи с авто-победой).
  3. Сформировать матчи раунда 1.
  4. Для каждого раунда создать placeholder-матчи следующего раунда (ссылки на предыдущие).
- **Сервисы**:
  - `BracketBuilder`: функция `buildTournament(items: Item[], title: string): Tournament`.
  - `MatchResolver`: обновляет матч победителем, каскадно создаёт участников следующего раунда.
- **Состояние UI**:
  - Hook `useTournament(id)` с мемоизацией и синхронизацией с localStorage.
  - Reducer events: `CREATE`, `SET_WINNER`, `RESET`, `DELETE`.

### 5. Работа с localStorage
- Создать утилиту `storage.ts` с безопасным JSON parse/stringify, namespace-ключами.
- Реализовать синхронизацию: при изменениях — `repository.save`.
- Предусмотреть миграции версий (свойство `schemaVersion` в Tournament, при чтении — нормализация).
- Добавить в UI индикатор успешного сохранения (toast/alert).

### 6. CSV импорт/экспорт
- Модуль `csv/parser.ts`: использовать встроенный `FileReader`, парсить строки (разделитель `,`/`;` автоматическое определение).
- Поддержка заголовков `name`, `description`, `image`.
- Обработка ошибок (пустые строки, отсутствие name).
- `csv/export.ts`: генерация CSV со списком участников и итогов (для будущего расширения).
- UI: drag&drop зона, предпросмотр таблицы, возможность удалить строки.

### 7. Управление изображениями
- Опции: URL или base64 data URI (при импорте из CSV).
- Валидация URL, предпросмотр через `<img>` c fallback.
- Локальные файлы: использовать `FileReader` → data URL, хранить в Item.image.

### 8. UI и UX
- **Компоненты**:
  - `ItemCard`, `MatchCard`, `TournamentSummary`, `Header`, `Footer`.
  - Универсальные кнопки, форма ввода, модальные окна.
- **Маршрутизация**: React Router (BrowserRouter + HashRouter? Для gh-pages лучше HashRouter).
- **Стили**: CSS Modules или styled-components (для MVP — CSS Modules).
- **Адаптивность**: layout сетки (grid/flex), поддержка мобильных.
- **Доступность**: aria-labels на кнопках выбора, клавиатурная навигация.

### 9. Тестирование
- Юнит-тесты (Jest + React Testing Library) на:
  - `BracketBuilder` (корректность сетки, byes).
  - Reducer `SET_WINNER`.
  - Компоненты: рендер матчей, выбор победителя.
- E2E (опционально, позже) — Cypress.

### 10. Деплой на GitHub Pages
- Добавить в `package.json` `"homepage": "https://<username>.github.io/<repo>"`.
- Скрипты: `"deploy": "gh-pages -d dist"`.
- GitHub Action: `on: push to main -> npm ci -> npm run build -> deploy`.
- Документация по запуску (README: `npm install`, `npm run dev`).

### 11. Бэклог улучшений (после MVP)
- Авторизация и сохранение в бекенде.
- Поддержка double elimination.
- Общий доступ к турниру (share link).
- Режим голосования несколькими пользователями.

---

### Тестирование
⚠️ Тесты не запускались — режим обзора без исполнения кода.
